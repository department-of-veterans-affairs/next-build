import Debug from 'debug'

const logger = Debug('retry-fetcher')
const log = logger.extend('log')
const error = logger.extend('error')

const DEFAULT_RETRY_COUNT = 5
const DEFAULT_MAX_CONCURRENT_REQUESTS = 8

function getPositiveIntegerEnv(name: string, fallback: number): number {
  const rawValue = process.env[name]
  const parsedValue = rawValue ? Number.parseInt(rawValue, 10) : NaN
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback
}

function createLimiter(maxConcurrency: number) {
  const queue: Array<() => void> = []
  let activeCount = 0

  const releaseNext = () => {
    if (activeCount >= maxConcurrency) {
      return
    }

    const next = queue.shift()
    if (!next) {
      return
    }

    activeCount += 1
    next()
  }

  return async function runWithLimit<T>(task: () => Promise<T>): Promise<T> {
    await new Promise<void>((resolve) => {
      queue.push(resolve)
      releaseNext()
    })

    try {
      return await task()
    } finally {
      activeCount -= 1
      releaseNext()
    }
  }
}

/**
 * Creates a fetcher function with retry logic for Drupal API requests.
 * Retries failed requests up to 5 times.
 * Does not retry on 404/403 errors unless the path is a JSON API path.
 */
export function createFetcherWithRetry(
  retryCount: number = DEFAULT_RETRY_COUNT,
  maxConcurrentRequests: number = getPositiveIntegerEnv(
    'CMS_FETCH_CONCURRENCY',
    DEFAULT_MAX_CONCURRENT_REQUESTS
  )
) {
  const runWithLimit = createLimiter(maxConcurrentRequests)

  return async (input: RequestInfo, init: RequestInit = {}) => {
    const wrappedFetch = async (attempt: number) => {
      const response = await runWithLimit(async () => fetch(input, init))

      if (!response.ok) {
        const logOrError = attempt <= retryCount ? log : error
        logOrError(
          `Failed request (Attempt ${attempt} of ${retryCount + 1}): %o`,
          {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
          }
        )

        const errorMessage = `Failed request to ${response.url}: ${response.status} ${response.statusText}`
        const urlObj = new URL(response.url)
        const isJsonApiPath = /^\/jsonapi\//.test(urlObj.pathname)

        // Don't retry if we shouldn't, jsonapi paths should retry
        if ([404, 403].includes(response.status) && !isJsonApiPath) {
          log(`Aborting retry: ${response.status} received`)
          const { AbortError } = await import('p-retry')
          throw new AbortError(new Error(errorMessage, { cause: response }))
        }

        throw new Error(errorMessage, { cause: response })
      }

      return response
    }

    // Note: Uses dynamic imports for p-retry because Jest doesn't currently support ES modules
    // in dependencies during test execution. Static imports would cause Jest to fail with
    // "Cannot use import statement outside a module" errors.
    const pRetry = await import('p-retry')
    return pRetry.default(wrappedFetch, {
      retries: retryCount,
    })
  }
}

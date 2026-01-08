const DEFAULT_RETRY_COUNT = 5

/**
 * Creates a fetcher function with retry logic for Drupal API requests.
 * Retries failed requests up to 5 times (configurable via NEXT_PUBLIC_PROXY_FETCHER_RETRY_COUNT).
 * Does not retry on 404/403 errors unless the path is a JSON API path.
 */
export function createFetcherWithRetry(
  retryCount: number = DEFAULT_RETRY_COUNT
) {
  return async (input: RequestInfo, init: RequestInit = {}) => {
    const wrappedFetch = async () => {
      const response = await fetch(input, init)

      if (!response.ok) {
        const errorMessage = `Failed request to ${response.url}: ${response.status} ${response.statusText}`
        const urlObj = new URL(response.url)
        const isJsonApiPath = /^\/jsonapi\//.test(urlObj.pathname)

        // Don't retry if we shouldn't, jsonapi paths should retry
        if ([404, 403].includes(response.status) && !isJsonApiPath) {
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

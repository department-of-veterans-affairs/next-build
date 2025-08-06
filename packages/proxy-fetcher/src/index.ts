import crossFetch from 'cross-fetch'
import Debug from 'debug'
import { SocksProxyAgent } from 'socks-proxy-agent'

const logger = Debug('proxy-fetcher')
const log = logger.extend('log')
const error = logger.extend('error')

/**
 * Creates a custom fetcher function with support for SOCKS proxying,
 * certificate management, and automatic retrying of failed requests. The
 * fetcher adapts based on the environment and target host, ensuring
 * compatibility with internal VA servers and local development setups.
 *
 * Behavior:
 * - Adds custom certificate authority (CA) files when the target host matches
 *   specific VA domains.
 * - Configures a SOCKS proxy for local environments or when certain conditions
 *   are met.
 * - Retries failed requests up to 5 times using the `p-retry` library for
 *   improved resilience.
 * - Logs request failures based on the `debug` flag and the retry attempt.
 *
 * Example Usage:
 * ```ts
 * const fetcher = getFetcher('https://va-gov-cms.ddev.site');
 * const response = await fetcher('https://example.com/flags_list', { method: 'GET' });
 * const data = await response.json();
 * ```
 */
export const getFetcher = (
  /**
   * The base URL for the Drupal instance. (e.g. https://va-gov-cms.ddev.site)
   */
  baseUrl: string
) =>
  /**
   * Fetches the resource at `input`, using the SOCKS proxy and managing
   * certificates and retries as needed.
   */
  async function fetcher(
    /**
     * The resource to fetch. Must include the base URL for the Drupal instance.
     * (e.g. htts://va-gov-cms.ddev.site/flags_list)
     */
    input: RequestInfo,
    /**
     * Any parameters to pass to the underlying `crossFetch` call.
     */
    init: RequestInit = {}
  ) {
    const url = new URL(baseUrl)
    const host = url.host

    // CI envs don't need the SOCKS proxy.
    const useProxy =
      (host.match(/cms\.va\.gov$/) || host.match(/vfs\.va\.gov$/)) &&
      (process.env.APP_ENV === 'local' ||
        typeof process.env.APP_ENV === 'undefined')
    const syswideCas = await import('syswide-cas')

    // If using an internal VA server, add VA cert.
    if (useProxy) {
      syswideCas.addCAs('certs/VA-Internal-S2-RCA-combined.pem')
    }

    // If using local cms through ddev, add the cert for https.
    if (host.match('va-gov-cms.ddev.site')) {
      syswideCas.addCAs('certs/rootCA.pem')
    }

    const agent = new SocksProxyAgent('socks://127.0.0.1:2001')
    const options = {
      agent: useProxy ? agent : null,
      ...init,
    }

    // Wrap fetching in p-retry for resilience.
    const retryCount = 5
    const wrappedCrossFetch = async (attempt) => {
      const response = await crossFetch(input, {
        ...options,
      })

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

        // Don't retry if we shouldn't
        if ([404, 403].includes(response.status)) {
          log(`Aborting retry: ${response.status} received`)
          const { AbortError } = await import('p-retry')
          throw new AbortError(new Error(errorMessage, { cause: response }))
        }

        throw new Error(errorMessage, { cause: response })
      }

      return response
    }

    const pRetry = await import('p-retry')
    return pRetry.default(wrappedCrossFetch, {
      retries: retryCount,
    })
  }

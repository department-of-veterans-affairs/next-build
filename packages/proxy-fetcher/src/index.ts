import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'

export const getFetcher =
  (baseUrl: string, debug: boolean = false) =>
  async (input: RequestInfo, init: RequestInit = {}) => {
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

      // Log request failures:
      //  In debug mode: always
      //  In non-debug mode: only on final attempt
      const logFailedRequest = debug ? true : attempt === retryCount + 1

      if (!response.ok) {
        if (logFailedRequest) {
          /*eslint-disable-next-line*/
          console.log(
            `Failed request (Attempt ${attempt} of ${retryCount + 1}): ${
              response.url
            }`
          )
        }
        throw new Error('Failed request')
      }
      return response
    }

    const pRetry = await import('p-retry')
    return pRetry.default(wrappedCrossFetch, {
      retries: retryCount,
    })
  }

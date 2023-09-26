import { DrupalClient } from 'next-drupal'
import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'

export const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'cms.va.gov'

const url = new URL(baseUrl)
const host = url.host

// tugboat env doesn't need the SOCKS proxy. APP_ENV set in tugboat
export const useProxy =
  host.match(/cms\.va\.gov$/) && process.env.APP_ENV != 'tugboat'

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  const retryCount = 5
  const syswideCas = await import('syswide-cas')

  // if using an internal VA server, add VA cert
  if (useProxy) {
    syswideCas.addCAs('certs/VA-Internal-S2-RCA-combined.pem')
  }

  // if using local cms through ddev, add the cert for https
  if (host.match('va-gov-cms.ddev.site')) {
    syswideCas.addCAs('certs/rootCA.pem')
  }

  const agent = new SocksProxyAgent('socks://127.0.0.1:2001')
  const options = {
    agent: useProxy ? agent : null,
    ...init,
  }

  // Wrap fetching in p-retry for resilience.
  const wrappedCrossFetch = async (attempt: number) => {
    const response = await crossFetch(input, {
      ...options,
    })
    if (!response.ok) {
      /*eslint-disable-next-line*/
      console.log(
        `Failed request (Attempt ${attempt} of ${retryCount + 1}): ${
          response.url
        }`
      )
      throw new Error('Failed request')
    }
    return response
  }

  const pRetry = await import('p-retry')
  return pRetry.default(wrappedCrossFetch, {
    retries: retryCount,
  })
}

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher,
  useDefaultResourceTypeEntry: true,
  throwJsonApiErrors: false,
})

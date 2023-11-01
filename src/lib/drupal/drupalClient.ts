import { DrupalClient } from 'next-drupal'
import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'

// Default to local CMS endpoint.
export const baseUrl =
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://va-gov-cms.ddev.site'

const url = new URL(baseUrl)
const host = url.host

// CI envs don't need the SOCKS proxy.
export const useProxy =
  host.match(/cms\.va\.gov$/) &&
  process.env.APP_ENV != 'tugboat' &&
  process.env.APP_ENV != 'gha'

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  const retryCount = 5
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
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
  previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
  forceIframeSameSiteCookie: process.env.NODE_ENV === 'development',
})

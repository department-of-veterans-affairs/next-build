import { DrupalClient } from 'next-drupal'
import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'

export const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'cms.va.gov'

const url = new URL(baseUrl)
const host = url.host

const allowedHosts = ['cms.va.gov', 'va-gov-cms.ddev.site']

// tugboat env doesn't need the SOCKS proxy. APP_ENV set in tugboat
export const useProxy =
  allowedHosts.includes(host) && process.env.APP_ENV != 'tugboat'

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  if (useProxy) {
    const syswideCas = await import('syswide-cas')
    syswideCas.addCAs('certs/VA-Internal-S2-RCA-combined.pem')
  }
  const agent = new SocksProxyAgent('socks://127.0.0.1:2001')
  const options = {
    agent: useProxy ? agent : null,
    ...init,
  }

  // Wrap fetching in p-retry for resilience.
  const wrappedCrossFetch = async () => {
    return crossFetch(input, {
      ...options,
    })
  }
  const pRetry = await import('p-retry')
  return pRetry.default(wrappedCrossFetch, {
    retries: 5,
  })
}

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher,
})

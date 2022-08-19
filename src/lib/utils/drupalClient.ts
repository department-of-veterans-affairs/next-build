import { DrupalClient } from 'next-drupal'
import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import pRetry from 'p-retry'

export const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'cms.va.gov'
export const useProxy = baseUrl.includes('cms.va.gov')

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  if (useProxy) {
    const syswideCas = await import('syswide-cas')
    syswideCas.addCAs('certs/VA-Internal-S2-RCA1-v1.pem')
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
  return pRetry(wrappedCrossFetch, {
    retries: 5,
  })
}

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher,
})

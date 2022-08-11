import { DrupalClient } from 'next-drupal'
import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { addCAs } from 'syswide-cas'

export const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'cms.va.gov'
export const useProxy = baseUrl.includes('cms.va.gov')
if (useProxy) {
  addCAs('certs/VA-Internal-S2-RCA1-v1.pem')
}
export const fetcher = (input: RequestInfo, init?: RequestInit) => {
  const agent = new SocksProxyAgent('socks://127.0.0.1:2001')
  const options = {
    agent: useProxy ? agent : null,
    ...init,
  }

  return crossFetch(input, {
    ...options,
  })
}

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher,
})

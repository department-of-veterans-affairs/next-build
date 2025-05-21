/**
 * This is essentially a copy of what's in the drupalClient.ts module, but
 * copying it over here for use in the script because importing it from
 * next-build/src/lib/drupal/drupalClient.ts is a pain.
 */

import { DrupalClient } from 'next-drupal'

/* eslint-disable import/no-extraneous-dependencies */
import { SocksProxyAgent } from 'socks-proxy-agent'
import fetch from 'node-fetch'

const syswideCas = await import('syswide-cas')
syswideCas.addCAs('certs/VA-Internal-S2-RCA-combined.pem')
syswideCas.addCAs('certs/rootCA.pem')

const baseUrl =
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://va-gov-cms.ddev.site'

const debug = process.env.DEBUG === 'true'

const proxyFetch = (input: RequestInfo, init: RequestInit = {}) => {
  const agent = new SocksProxyAgent('socks5h://127.0.0.1:2001')
  return fetch(input, { ...init, agent })
}

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher: proxyFetch,
  useDefaultResourceTypeEntry: true,
  throwJsonApiErrors: false,
  auth: {
    // @ts-expect-error It's possible for the env vars to not be set properly
    clientId: process.env.DRUPAL_CLIENT_ID,
    // @ts-expect-error It's possible for the env vars to not be set properly
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
  previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
  // Add request header to tell the CMS to return public-facing URLs for files.
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    'File-Public-Base-Url-Check': 'true',
  },
})

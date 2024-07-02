import { DrupalClient } from 'next-drupal'
import { createRedisClient, redisCache } from '@/lib/utils/redisCache'
import { getFetcher } from 'proxy-fetcher'

const baseUrl =
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://va-gov-cms.ddev.site'

const debug = process.env.DEBUG === 'true'

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher: getFetcher(baseUrl, debug),
  useDefaultResourceTypeEntry: true,
  throwJsonApiErrors: false,
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
  // Generally use cache for `yarn export` as it generates all pages
  cache:
    process.env.USE_REDIS === 'true'
      ? redisCache(createRedisClient(process.env.REDIS_URL))
      : null,
  previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
  // Add request header to tell the CMS to return public-facing URLs for files.
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    'File-Public-Base-Url-Check': 'true',
  },
})

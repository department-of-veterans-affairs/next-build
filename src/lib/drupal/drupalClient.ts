import { DrupalClient } from 'next-drupal'
import { createRedisClient, redisCache } from '@/lib/utils/redisCache'
import { createFetcherWithRetry } from './createFetcherWithRetry'

const baseUrl =
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://va-gov-cms.ddev.site'

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher: createFetcherWithRetry(),
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
  // Add request header to tell the CMS to return public-facing URLs for files.
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    'File-Public-Base-Url-Check': 'true',
  },
})

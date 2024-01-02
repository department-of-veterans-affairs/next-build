import { DrupalClient } from 'next-drupal'
import { createRedisClient, redisCache } from '@/lib/utils/redisCache'
import { getFetcher } from 'proxy-fetcher'

const baseUrl =
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://va-gov-cms.ddev.site'

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher: getFetcher(baseUrl),
  useDefaultResourceTypeEntry: true,
  throwJsonApiErrors: false,
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET,
  },
  // Generally use cache for `yarn export` as it generates all pages
  cache: process.env.USE_REDIS
    ? redisCache(createRedisClient(process.env.REDIS_URL))
    : null,
  previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
})

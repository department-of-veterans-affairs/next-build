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
  // cache: redisCache(createRedisClient(process.env.REDIS_URL)),
  previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
})

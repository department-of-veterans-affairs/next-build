/* eslint-disable no-console */
import { DataCache } from 'next-drupal'
import { createClient } from 'redis'

export async function createRedisClient(
  url: string
): Promise<ReturnType<typeof createClient>> {
  return await createClient({ url })
    .on('error', (err) => console.error(`Redis Error: ${err}`))
    .on('connect', () => console.info('Redis connected'))
    .on('reconnecting', () => console.info('Redis reconnecting'))
    .on('ready', () => console.info('Redis ready!'))
    .connect()
}

export function redisCache(
  client: Promise<ReturnType<typeof createClient>>
): DataCache {
  return {
    async set(key, value) {
      // Need to double await here to wait for the client, then wait for the set.
      return await (await client).set(key, value)
    },
    async get(key) {
      // Need to double await here to wait for the client, then wait for the get.
      return await (await client).get(key)
    },
  }
}

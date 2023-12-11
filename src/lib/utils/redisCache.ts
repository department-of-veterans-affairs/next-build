/* eslint-disable no-console */
import { DataCache } from 'next-drupal'
import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis'

export async function createRedisClient(
  url
): Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts>> {
  return await createClient({ url })
    .on('error', (err) => console.error(`Redis Error: ${err}`))
    .on('connect', () => console.info('Redis connected'))
    .on('reconnecting', () => console.info('Redis reconnecting'))
    .on('ready', () => console.info('Redis ready!'))
    .connect()
}

export function redisCache(
  client: Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts>>
): DataCache {
  return {
    async set(key, value) {
      return (await client).set(key, value)
    },
    async get(key) {
      return (await client).get(key)
    },
  }
}

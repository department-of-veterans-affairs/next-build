/* eslint-disable no-console */
import { DataCache } from 'next-drupal'
import { createClient, RedisClientType } from 'redis'

export async function createRedisClient(url): Promise<RedisClientType> {
  let isReady = false

  let redisClient: RedisClientType
  if (!isReady) {
    redisClient = createClient({ url })
    redisClient.on('error', (err) => console.error(`Redis Error: ${err}`))
    redisClient.on('connect', () => console.info('Redis connected'))
    redisClient.on('reconnecting', () => console.info('Redis reconnecting'))
    redisClient.on('ready', () => {
      isReady = true
      console.info('Redis ready!')
    })
  }

  await redisClient.connect()

  return redisClient
}

export function redisCache(client: Promise<RedisClientType>): DataCache {
  let redis: RedisClientType

  client
    .then((connection) => {
      redis = connection
    })
    .catch((err) => {
      console.error({ err }, 'Failed to connect to Redis')
    })

  return {
    async set(key, value) {
      return await redis.set(key, value)
    },
    async get(key) {
      return await redis.get(key)
    },
  }
}

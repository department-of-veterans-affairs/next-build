/* eslint-disable no-console */
import { DataCache } from 'next-drupal'
import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType
let isReady: boolean

async function getCache(): Promise<RedisClientType> {
  if (!isReady) {
    // connects to a running redis server, defaults to 127.0.0.1:6379
    redisClient = createClient({
      url: process.env.REDIS_URL,
    })
    redisClient.on('error', (err) => console.error(`Redis Error: ${err}`))
    redisClient.on('connect', () => console.info('Redis connected'))
    redisClient.on('reconnecting', () => console.info('Redis reconnecting'))
    redisClient.on('ready', () => {
      isReady = true
      console.info('Redis ready!')
    })
    await redisClient.connect()
  }
  return redisClient
}

getCache()
  .then((connection) => {
    redisClient = connection
  })
  .catch((err) => {
    console.error({ err }, 'Failed to connect to Redis')
  })

// This is the cache wrapper that drupalClient can use
const redisCache: DataCache = {
  async set(key, value) {
    const cache = await getCache()
    return await cache.set(key, value)
  },
  async get(key) {
    const cache = await getCache()
    return await cache.get(key)
  },
}

export { getCache, redisCache }

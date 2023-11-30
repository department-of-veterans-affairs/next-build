import { DataCache } from 'next-drupal'
import Redis from 'ioredis'

// connects to a running redis server, defaults to 127.0.0.1:6379
const redis = new Redis()

export const redisCache: DataCache = {
  async set(key, value) {
    return await redis.set(key, value)
  },
  async get(key) {
    return await redis.get(key)
  },
}

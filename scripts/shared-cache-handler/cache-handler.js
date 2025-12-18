/**
 * Next.js Cache Handler Configuration
 *
 * This file configures the S3 cache handler for Next.js ISR.
 * It will be used when USE_S3_CACHE=true is set.
 */

import S3CacheHandler from '../../packages/s3-cache-handler/dist/index.js'

class ConfiguredS3CacheHandler extends S3CacheHandler {
  constructor(options) {
    const config = {
      bucketName:
        process.env.S3_CACHE_BUCKET_NAME || 'nextjs-cache-staging-test',
      region: process.env.AWS_REGION || 'us-gov-west-1',
      keyPrefix: process.env.S3_CACHE_KEY_PREFIX || 'nextjs-cache',
      debug: process.env.S3_CACHE_DEBUG === 'true',
    }

    // Only add credentials if explicitly provided
    // If not provided, will use the default AWS credential chain (IAM role, environment, etc.)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }

      // Add session token for temporary credentials
      if (process.env.AWS_SESSION_TOKEN) {
        config.credentials.sessionToken = process.env.AWS_SESSION_TOKEN
      }
    }

    super(config)
  }
}

export default ConfiguredS3CacheHandler

# S3 Cache Handler for Next.js

A custom Next.js cache handler that stores Incremental Static Regeneration (ISR) cache files in AWS S3. This package enables distributed caching across multiple Next.js instances by using S3 as a shared cache backend.

## Features

- ✅ Full support for Next.js ISR and revalidation
- ✅ Compatible with Next.js 14+
- ✅ Distributed cache sharing across multiple instances
- ✅ Automatic handling of cache invalidation
- ✅ TypeScript support
- ✅ Configurable S3 bucket and key prefixes
- ✅ Debug logging support

## Installation

```bash
yarn add s3-cache-handler
```

Or if using npm:

```bash
npm install s3-cache-handler
```

## Configuration

### 1. Build the Package

First, build the cache handler package:

```bash
cd packages/s3-cache-handler
yarn build
```

### 2. Configure Next.js

The cache handler is already configured in `next.config.js` and can be enabled via environment variable:

```javascript
// next.config.js
{
  cacheHandler: process.env.USE_S3_CACHE === 'true'
    ? resolve(__dirname, './scripts/shared-cache-handler/cache-handler.js')
    : undefined,

  cacheMaxMemorySize: process.env.USE_S3_CACHE === 'true' ? 0 : undefined,
}
```

### 3. Create Cache Handler Configuration

Create a `cache-handler.js` file in your project root (or specify a custom location):

```javascript
// cache-handler.js
const S3CacheHandler = require('./packages/s3-cache-handler/dist/index.js')

module.exports = S3CacheHandler

module.exports.S3CacheHandler = S3CacheHandler

// Configuration is passed via environment variables or constructor options
```

### 4. Environment Variables

Set the following environment variables:

```bash
# Enable S3 cache
USE_S3_CACHE=true

# AWS Configuration
AWS_REGION=us-gov-west-1

# AWS Credentials - Multiple Options:

# Option 1: Use IAM Role (Recommended for production)
# The AWS SDK will automatically use the IAM role attached to your EC2/ECS/Lambda instance.
# No credentials needed - just remove or comment out AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN.

# Option 2: AWS CLI Credentials (Recommended for local development)
# Login using AWS CLI, and the SDK will automatically use those credentials:
#   aws sso login --profile your-profile
#   OR
#   aws configure
# No environment variables needed - the SDK reads from ~/.aws/credentials automatically.

# Option 3: Static credentials (alternative for local development)
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key

# Option 4: Temporary credentials (includes session token)
# AWS_ACCESS_KEY_ID=your-temp-access-key
# AWS_SECRET_ACCESS_KEY=your-temp-secret-key
# AWS_SESSION_TOKEN=your-session-token

# S3 Bucket Configuration
S3_CACHE_BUCKET_NAME=your-bucket-name
S3_CACHE_KEY_PREFIX=next-cache  # Optional, defaults to 'next-cache'

# Debug logging (optional)
S3_CACHE_DEBUG=true
```

### 5. Programmatic Configuration (Alternative)

You can also configure the handler programmatically:

```javascript
// cache-handler.js
const S3CacheHandler = require('./packages/s3-cache-handler/dist/index.js')

class ConfiguredS3CacheHandler extends S3CacheHandler {
  constructor() {
    super({
      bucketName: process.env.S3_CACHE_BUCKET_NAME || 'my-nextjs-cache',
      region: process.env.AWS_REGION || 'us-gov-west-1',
      keyPrefix: process.env.S3_CACHE_KEY_PREFIX || 'nextjs-cache',
      debug: process.env.S3_CACHE_DEBUG === 'true',
      // Optional: provide credentials explicitly
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }
}

module.exports = ConfiguredS3CacheHandler
```

## Usage

### Basic ISR with Revalidation

```typescript
// pages/index.tsx
export async function getStaticProps() {
  const data = await fetchData()

  return {
    props: { data },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
```

### On-Demand Revalidation

```typescript
// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Revalidate specific path
    await res.revalidate('/')
    await res.revalidate('/about')

    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
```

## AWS S3 Setup

### 1. Create S3 Bucket

```bash
aws s3 mb s3://your-nextjs-cache-bucket --region us-gov-west-1
```

### 2. Configure Bucket Policy (Optional)

For production, configure appropriate bucket policies:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws-us-gov:iam::ACCOUNT-ID:role/NextjsRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws-us-gov:s3:::your-nextjs-cache-bucket/*"
    }
  ]
}
```

### 3. IAM Permissions

Ensure your IAM role/user has these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws-us-gov:s3:::your-nextjs-cache-bucket/*"
    }
  ]
}
```

## How It Works

1. **Cache Storage**: When Next.js generates a page (ISR), the cache handler stores the rendered HTML and JSON data in S3
2. **Cache Retrieval**: On subsequent requests, Next.js checks S3 for cached content
3. **Revalidation**: When the revalidate period expires or on-demand revalidation is triggered:
   - Next.js deletes the old cache entry from S3
   - Regenerates the page
   - Stores the new version in S3

## Cache Key Structure

Cache keys in S3 follow this pattern:

```
{keyPrefix}/{normalizedPath}
```

Example:

- Page: `/blog/post-1`
- Key: `next-cache/blog/post-1`

## Debugging

Enable debug logging to see cache operations:

```bash
S3_CACHE_DEBUG=true yarn dev
```

This will output logs like:

```
[S3CacheHandler] S3 Cache Handler initialized { bucket: 'my-cache', prefix: 'next-cache', region: 'us-gov-west-1' }
[S3CacheHandler] Getting cache for key: next-cache/index
[S3CacheHandler] Cache hit for key: next-cache/index
[S3CacheHandler] Setting cache for key: next-cache/about with revalidate: 60
```

## Development

### Build

```bash
yarn build
```

## Troubleshooting

### Expired Token Error

**Error:** `ExpiredToken: The provided token has expired`

**Cause:** Using temporary AWS credentials (with session token) that have expired.

**Solutions:**

1. **Use IAM Role (Recommended):** Remove AWS credentials from environment variables and let the AWS SDK use the IAM role attached to your instance:

   ```bash
   # Remove these from .env
   unset AWS_ACCESS_KEY_ID
   unset AWS_SECRET_ACCESS_KEY
   unset AWS_SESSION_TOKEN
   ```

2. **Refresh temporary credentials:** If using temporary credentials (STS), ensure you refresh them before they expire and include the session token:

   ```bash
   AWS_SESSION_TOKEN=your-new-session-token
   AWS_ACCESS_KEY_ID=your-new-access-key
   AWS_SECRET_ACCESS_KEY=your-new-secret-key
   ```

3. **Use long-term credentials:** For development, use IAM user credentials (not recommended for production):
   ```bash
   AWS_ACCESS_KEY_ID=your-iam-user-key
   AWS_SECRET_ACCESS_KEY=your-iam-user-secret
   # No session token needed
   ```

### Cache Not Working

1. Verify S3 bucket exists and is accessible
2. Check AWS credentials are correct (or remove them to use IAM role)
3. Ensure `USE_S3_CACHE=true` is set
4. Check IAM permissions
5. Enable debug logging with `S3_CACHE_DEBUG=true`

### Slow Performance

- Consider using S3 Transfer Acceleration
- Ensure the S3 bucket is in the same region as your Next.js deployment
- Use CloudFront in front of your S3 bucket for faster access

### Permission Errors

Verify your IAM role has all required S3 permissions (GetObject, PutObject, DeleteObject, HeadObject)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

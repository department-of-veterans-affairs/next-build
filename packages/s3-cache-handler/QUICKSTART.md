# S3 Cache Handler - Quick Start Guide

## Overview

This package provides a custom Next.js cache handler that stores ISR (Incremental Static Regeneration) cache files in AWS S3 instead of the local filesystem. This enables distributed caching across multiple Next.js instances.

## Quick Setup

### 1. Install Dependencies

Dependencies are already installed via the workspace.

### 2. Build the Package

```bash
cd packages/s3-cache-handler
yarn build
```

Or from the project root:

```bash
yarn workspace s3-cache-handler build
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp packages/s3-cache-handler/.env.example .env.local
```

Edit `.env.local` with your settings:

```bash
# Enable S3 cache handler
USE_S3_CACHE=true
# Specify the S3 storage
S3_CACHE_BUCKET_NAME=nextjs-cache-staging-test
# AWS Configuration
AWS_REGION=us-gov-west-1

# AWS Credentials - Choose ONE option:

# Option 1 (Recommended for local development): Login via AWS CLI
# Run: aws sso login --profile your-profile
# OR: aws configure
# No environment variables needed - SDK reads from ~/.aws/credentials

# Option 2 (Recommended for production): Use IAM role
# Leave credentials unset - IAM role on EC2/ECS will be used automatically

# Option 3: Set credentials manually (not recommended)
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_SESSION_TOKEN=your-session-token  # For temporary credentials only

# S3 Bucket Configuration
S3_CACHE_BUCKET_NAME=your-bucket-name
S3_CACHE_KEY_PREFIX=next-cache

# Debug (optional)
S3_CACHE_DEBUG=true
```

### 4. AWS Authentication for Local Development

Login to AWS using the CLI (credentials will be stored in `~/.aws/credentials`):

```bash
# Option A: SSO Login (recommended if your org uses AWS SSO)
aws sso login --profile your-profile

# Option B: Configure with access keys
aws configure
```

After logging in, the SDK will automatically use these credentials - no environment variables needed!

### 5. Create S3 Bucket

If you haven't already, create an S3 bucket:

```bash
aws s3 mb s3://your-bucket-name --region us-gov-west-1
```

### 6. Configure IAM Permissions

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
      "Resource": "arn:aws-us-gov:s3:::your-bucket-name/*"
    }
  ]
}
```

### 7. Start Next.js

```bash
USE_S3_CACHE=true yarn dev
```

Or for production:

```bash
USE_S3_CACHE=true yarn build
USE_S3_CACHE=true yarn start
```

## Testing

### Test Cache Write

1. Visit a page with ISR (e.g., `http://localhost:3000/example-page`)
2. Check S3 bucket for cached files: `s3://your-bucket-name/next-cache/example-page`
3. With `S3_CACHE_DEBUG=true`, check logs for:
   ```
   [S3CacheHandler] Setting cache for key: next-cache/example-page
   ```

### Test Cache Read

1. Visit the same page again
2. Check logs for cache hit:
   ```
   [S3CacheHandler] Getting cache for key: next-cache/example-page
   [S3CacheHandler] Cache hit for key: next-cache/example-page
   ```

### Test Revalidation

1. Wait for revalidate period to expire (or use on-demand revalidation)
2. Visit the page again
3. Check logs for cache deletion and regeneration:
   ```
   [S3CacheHandler] Deleting cache for key: next-cache/example-page
   [S3CacheHandler] Setting cache for key: next-cache/example-page
   ```

## Using On-Demand Revalidation

Create an API route (see `example-revalidation-api.ts`):

```typescript
// pages/api/revalidate.ts
export default async function handler(req, res) {
  await res.revalidate('/your-path')
  return res.json({ revalidated: true })
}
```

Trigger revalidation:

```bash
curl -X POST http://localhost:3000/api/revalidate
```

## Troubleshooting

### Issue: Cache not being written to S3

**Solution:**

1. Check AWS credentials are configured correctly
2. Verify `USE_S3_CACHE=true` is set
3. Enable debug logging: `S3_CACHE_DEBUG=true`
4. Check IAM permissions
5. Verify S3 bucket exists and is accessible

### Issue: Permission denied errors

**Solution:**

1. Check IAM policy includes all required actions (GetObject, PutObject, DeleteObject, HeadObject)
2. Verify bucket name is correct
3. Check AWS region matches bucket location

### Issue: Slow performance

**Solution:**

1. Use S3 bucket in same region as Next.js deployment
2. Consider S3 Transfer Acceleration
3. Consider using CloudFront in front of S3

### Issue: Next.js config not loading cache handler

**Solution:**

1. Ensure package is built: `cd packages/s3-cache-handler && yarn build`
2. Check `dist/index.js` exists
3. Verify path in `next.config.js` is correct
4. Try absolute path instead of `require.resolve()`

## Architecture

### Cache Key Structure

```
{S3_CACHE_KEY_PREFIX}/{normalized-path}
```

Example:

- Path: `/blog/post-1`
- S3 Key: `next-cache/blog/post-1`

### Cache Lifecycle

1. **Request arrives** for a page with ISR
2. **Cache check**: Next.js calls `get(key)` on cache handler
3. **Cache hit**: Return cached data from S3
4. **Cache miss**: Generate page, call `set(key, data)` to store in S3
5. **Revalidation**:
   - Time-based: After `revalidate` seconds, call `delete(key)` then regenerate
   - On-demand: API route calls `res.revalidate(path)`, which calls `delete(key)`

## Integration with Existing Code

The cache handler integrates seamlessly with existing Next.js pages:

```typescript
// No code changes needed!
export const getStaticProps = async () => {
  return {
    props: { data },
    revalidate: 60, // Works automatically with S3 cache
  }
}
```

## Monitoring

### AWS CloudWatch Metrics

Monitor these S3 metrics:

- `NumberOfObjects`: Track cache growth
- `BucketSizeBytes`: Monitor storage usage
- `AllRequests`: Track cache access patterns
- `4xxErrors`: Detect permission issues
- `5xxErrors`: Detect S3 service issues

### Application Logs

With `S3_CACHE_DEBUG=true`, monitor:

- Cache hits/misses
- Write operations
- Delete operations (revalidation)
- Error messages

## Support

For issues or questions:

1. Check the main README.md
2. Enable debug logging for troubleshooting
3. Review AWS S3 and IAM configuration
4. Check Next.js cache handler documentation

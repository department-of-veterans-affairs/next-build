# Introduction for Accelerated Publishing - Shared Caching

Next.js shared caching allows multiple instances of an application to share a common cache, improving performance and reducing redundant work across deployments.

## How It Works

Cache Handlers: Next.js uses cache handlers to store build artifacts and data. By default, caching is stored locally on the filesystem, but you can implement custom cache handlers to share cache across instances.

### Key Caching Layers:

- Build Cache: Compilation artifacts, optimized images, and static assets
- Data Cache: Results from fetch() requests and data fetching functions
- Full Route Cache: Pre-rendered HTML and RSC payloads for static routes
- **Shared Implementation**: Custom cache handlers implement the CacheHandler interface and can store cache data in external services like Redis, S3, or databases. This allows multiple server instances (in horizontal scaling scenarios) to read from and write to the same cache.

Benefits:

Reduces build times by reusing compiled artifacts
Eliminates redundant API calls across instances
Improves cold start performance
Enables efficient horizontal scaling
Configuration: Set via cacheHandler in next.config.js and optionally cacheMaxMemorySize to control in-memory caching limits.

In production environments, shared caching is especially valuable for ISR (Incremental Static Regeneration) where multiple instances need to coordinate revalidation and serve consistent cached content.

## Our Implementation

- Environment Variable:
  **USE_S3_CACHE**
  **S3_CACHE_BUCKET_NAME**

- next.config.js update:

  // Custom cache handler for S3
  cacheHandler:
  process.env.USE_S3_CACHE === 'true'
  ? resolve(\_\_dirname, './scripts/shared-cache-handler/cache-handler.js')
  : undefined,

  cacheMaxMemorySize: process.env.USE_S3_CACHE === 'true' ? 0 : undefined, // Disable default in-memory cache when using Shared S3 Cache

- Custom Package Added
  **s3-cache-handler**
  This is the primary script to handle updating S3 storage. By default it will use the authorization of the host container for access privileges.

  - Key Note:
    This should only store generated Pages using the metadata.kind property. If that value equals "PAGE" or "PAGES" it will store the information. This is the key check for storing and retrieving pages built by drupal.

- Custom script:
  **shared-cache-handler/cache-handler.js**
  This is the entry point for our Nextjs server to use the shared caching for S3. This is used to configure and use the shared cache package.

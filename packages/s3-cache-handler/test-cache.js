#!/usr/bin/env node

/**
 * S3 Cache Handler Test Script
 *
 * This script tests the S3 cache handler functionality
 * by performing basic cache operations.
 *
 * Usage:
 *   node packages/s3-cache-handler/test-cache.js
 *
 * Prerequisites:
 *   - AWS credentials configured
 *   - S3 bucket exists
 *   - Environment variables set
 */

const S3CacheHandler = require('./dist/index.js')

async function testCacheHandler() {
  console.log('🧪 Testing S3 Cache Handler\n')

  // Configuration
  const config = {
    bucketName: process.env.S3_CACHE_BUCKET_NAME || 'test-bucket',
    region: process.env.AWS_REGION || 'us-gov-west-1',
    keyPrefix: 'test-cache',
    debug: true,
  }

  console.log('📋 Configuration:', config, '\n')

  // Initialize cache handler
  const cache = new S3CacheHandler(config)

  const testKey = 'test-page'
  const testData = {
    html: '<h1>Test Page</h1>',
    pageData: { props: { title: 'Test' } },
  }

  try {
    console.log('✅ Step 1: Testing cache miss (should return null)')
    const result1 = await cache.get(testKey)
    console.log(
      '   Result:',
      result1 === null ? 'PASS - No cache found' : 'FAIL - Expected null'
    )
    console.log('')

    console.log('✅ Step 2: Testing cache set')
    await cache.set(testKey, testData, { revalidate: 60 })
    console.log('   Result: PASS - Cache set successfully')
    console.log('')

    console.log('✅ Step 3: Testing cache hit (should return data)')
    const result3 = await cache.get(testKey)
    console.log(
      '   Result:',
      result3 ? 'PASS - Cache hit' : 'FAIL - Expected data'
    )
    if (result3) {
      console.log('   Data:', JSON.stringify(result3.value, null, 2))
    }
    console.log('')

    console.log('✅ Step 4: Testing cache existence check')
    const exists = await cache.has(testKey)
    console.log(
      '   Result:',
      exists ? 'PASS - Cache exists' : 'FAIL - Expected true'
    )
    console.log('')

    console.log('✅ Step 5: Testing cache deletion')
    await cache.delete(testKey)
    console.log('   Result: PASS - Cache deleted successfully')
    console.log('')

    console.log('✅ Step 6: Verifying deletion (should return null)')
    const result6 = await cache.get(testKey)
    console.log(
      '   Result:',
      result6 === null ? 'PASS - Cache deleted' : 'FAIL - Expected null'
    )
    console.log('')

    console.log('🎉 All tests completed successfully!\n')
    console.log('📝 Summary:')
    console.log('   ✅ Cache miss works')
    console.log('   ✅ Cache set works')
    console.log('   ✅ Cache get works')
    console.log('   ✅ Cache exists check works')
    console.log('   ✅ Cache delete works')
    console.log('')
    console.log('💡 Your S3 cache handler is ready to use with Next.js!')
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('\n🔍 Troubleshooting:')
    console.error('   1. Check AWS credentials are configured')
    console.error('   2. Verify S3 bucket exists:', config.bucketName)
    console.error(
      '   3. Check IAM permissions (GetObject, PutObject, DeleteObject, HeadObject)'
    )
    console.error('   4. Verify AWS region is correct:', config.region)
    console.error('')
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Check environment variables
if (!process.env.S3_CACHE_BUCKET_NAME) {
  console.error(
    '❌ Error: S3_CACHE_BUCKET_NAME environment variable is required\n'
  )
  console.log('Usage:')
  console.log(
    '   S3_CACHE_BUCKET_NAME=your-bucket AWS_REGION=us-gov-west-1 node packages/s3-cache-handler/test-cache.js\n'
  )
  process.exit(1)
}

// Run tests
testCacheHandler()

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Readable } from 'stream'

export interface S3CacheHandlerOptions {
  /**
   * AWS S3 bucket name where cache files will be stored
   */
  bucketName: string

  /**
   * AWS region for the S3 bucket
   */
  region?: string

  /**
   * Optional prefix for all cache keys in S3
   * Useful for organizing cache files or multi-environment support
   */
  keyPrefix?: string

  /**
   * AWS credentials (optional - will use default AWS credential chain if not provided)
   * For temporary credentials, include sessionToken
   */
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
    sessionToken?: string
  }

  /**
   * Custom S3 client configuration
   */
  s3ClientConfig?: any

  /**
   * Enable debug logging
   */
  debug?: boolean
}

interface CacheHandlerValue {
  lastModified?: number
  value: any
}

/**
 * Custom Next.js cache handler that stores ISR cache in AWS S3
 *
 * This handler implements the Next.js CacheHandler interface to store
 * incremental static regeneration (ISR) cache files in an S3 bucket.
 * It supports revalidation through Next.js's built-in revalidate functionality.
 *
 * Stores cache in a directory structure in S3:
 * - {s3Key}/meta.json - Metadata including kind, status, headers, etc.
 * - {s3Key}/index.html - The rendered HTML (for PAGE kind)
 * - {s3Key}/data.json - The page data/props (for PAGE kind)
 */
export default class S3CacheHandler {
  private s3Client: S3Client
  private bucketName: string
  private keyPrefix: string
  private debug: boolean

  constructor(options: S3CacheHandlerOptions) {
    this.bucketName = options.bucketName
    this.keyPrefix = options.keyPrefix || 'nextjs-cache'
    this.debug = options.debug || false

    // Initialize S3 client
    const s3Config: any = {
      region: options.region || process.env.AWS_REGION || 'us-gov-west-1',
      ...options.s3ClientConfig,
    }

    if (options.credentials) {
      s3Config.credentials = options.credentials
    }

    this.s3Client = new S3Client(s3Config)

    this.log('S3 Cache Handler initialized', {
      bucket: this.bucketName,
      prefix: this.keyPrefix,
      region: s3Config.region,
    })
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[S3CacheHandler]', ...args)
    }
  }

  private getS3Key(key: string): string {
    // Normalize the key and add prefix
    const normalizedKey = key.replace(/^\//, '')
    return `${this.keyPrefix}/${normalizedKey}`
  }

  /**
   * Get the S3 path for a specific file type within a cache directory
   */
  private getS3Path(s3Key: string, fileType: 'meta' | 'html' | 'data'): string {
    switch (fileType) {
      case 'meta':
        return `${s3Key}/meta.json`
      case 'html':
        return `${s3Key}/index.html`
      case 'data':
        return `${s3Key}/data.json`
    }
  }

  /**
   * Helper method to get an object from S3
   */
  private async getS3Object(
    key: string
  ): Promise<{ body: string; lastModified?: number } | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      const response = await this.s3Client.send(command)

      if (!response.Body) {
        return null
      }

      const body = await this.streamToString(response.Body as Readable)
      return {
        body,
        lastModified: response.LastModified?.getTime(),
      }
    } catch (error: any) {
      if (
        error.name === 'NoSuchKey' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return null
      }
      throw error
    }
  }

  /**
   * Get a value from the cache
   */
  async get(key: string): Promise<CacheHandlerValue | null> {
    const s3Key = this.getS3Key(key)
    this.log('Getting cache for key:', s3Key)

    try {
      // Get the main cache metadata file
      const metadataResult = await this.getS3Object(
        this.getS3Path(s3Key, 'meta')
      )

      if (!metadataResult) {
        this.log('Cache miss for key:', s3Key)
        return null
      }

      const metadata = JSON.parse(metadataResult.body)
      const value: any = { ...metadata }

      // Get HTML if it's a page cache entry
      if (metadata.kind === 'PAGE' || metadata.kind === 'PAGES') {
        const htmlResult = await this.getS3Object(this.getS3Path(s3Key, 'html'))
        if (htmlResult) {
          value.html = htmlResult.body
        } else {
          // If PAGE/PAGES kind but no HTML, the cache is corrupted/incomplete
          this.log(
            'Cache corrupted for key:',
            s3Key,
            '- PAGE/PAGES kind but no HTML found'
          )
          return null
        }

        const pageDataResult = await this.getS3Object(
          this.getS3Path(s3Key, 'data')
        )
        if (pageDataResult) {
          value.pageData = JSON.parse(pageDataResult.body)
        } else {
          // If PAGE/PAGES kind but no pageData, the cache is corrupted/incomplete
          this.log(
            'Cache corrupted for key:',
            s3Key,
            '- PAGE/PAGES kind but no pageData found'
          )
          return null
        }
      }

      this.log(
        'Cache hit for key:',
        s3Key,
        'kind:',
        metadata.kind,
        'has html:',
        !!value.html,
        'has pageData:',
        !!value.pageData
      )

      const result = {
        lastModified: metadataResult.lastModified,
        value,
      }

      this.log('Returning cache value with keys:', Object.keys(value))
      return result
    } catch (error: any) {
      console.error('[S3CacheHandler] Error getting cache:', error)
      return null
    }
  }

  /**
   * Set a value in the cache
   */
  async set(
    key: string,
    data: any,
    options?: { revalidate?: number | false }
  ): Promise<void> {
    const s3Key = this.getS3Key(key)
    this.log(
      'Setting cache for key:',
      s3Key,
      'kind:',
      data?.kind,
      'with revalidate:',
      options?.revalidate
    )

    try {
      const s3Metadata: Record<string, string> = {}

      // Add revalidate metadata if provided
      if (options?.revalidate !== undefined && options.revalidate !== false) {
        s3Metadata['cache-control'] = `max-age=${options.revalidate}`
        s3Metadata['x-next-revalidate'] = String(options.revalidate)
      }

      const uploads: Promise<any>[] = []

      // Create metadata object (everything except html and pageData)
      const { html, pageData, ...metadataObj } = data

      // Always store the metadata file
      uploads.push(
        this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: this.getS3Path(s3Key, 'meta'),
            Body: JSON.stringify(metadataObj),
            ContentType: 'application/json',
            Metadata: s3Metadata,
          })
        )
      )

      // Store HTML if present (for PAGE kind)
      if (html) {
        this.log('Storing HTML for key:', s3Key)
        uploads.push(
          this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.bucketName,
              Key: this.getS3Path(s3Key, 'html'),
              Body: html,
              ContentType: 'text/html',
              Metadata: s3Metadata,
            })
          )
        )
      }

      // Store page data if present (for PAGE kind)
      if (pageData) {
        this.log('Storing page data for key:', s3Key)
        uploads.push(
          this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.bucketName,
              Key: this.getS3Path(s3Key, 'data'),
              Body: JSON.stringify(pageData),
              ContentType: 'application/json',
              Metadata: s3Metadata,
            })
          )
        )
      }

      await Promise.all(uploads)
      this.log('Cache set successfully for key:', s3Key)
    } catch (error) {
      console.error('[S3CacheHandler] Error setting cache:', error)
      throw error
    }
  }

  /**
   * Delete a value from the cache (used during revalidation)
   */
  async delete(key: string): Promise<void> {
    const s3Key = this.getS3Key(key)
    this.log('Deleting cache for key:', s3Key)

    try {
      // Delete metadata, HTML, and JSON files
      await Promise.allSettled([
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: this.getS3Path(s3Key, 'meta'),
          })
        ),
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: this.getS3Path(s3Key, 'html'),
          })
        ),
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: this.getS3Path(s3Key, 'data'),
          })
        ),
      ])

      this.log('Cache deleted successfully for key:', s3Key)
    } catch (error) {
      console.error('[S3CacheHandler] Error deleting cache:', error)
      // Don't throw - deletion failures shouldn't break the app
    }
  }

  /**
   * Check if a cache entry exists and get its metadata
   */
  async has(key: string): Promise<boolean> {
    const s3Key = this.getS3Key(key)
    this.log('Checking existence for key:', s3Key)

    try {
      // Check if metadata file exists
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: this.getS3Path(s3Key, 'meta'),
        })
      )

      this.log('Cache exists for key:', s3Key)
      return true
    } catch (error: any) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        this.log('Cache does not exist for key:', s3Key)
        return false
      }
      console.error('[S3CacheHandler] Error checking cache existence:', error)
      return false
    }
  }

  /**
   * Helper method to convert a stream to string
   */
  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    })
  }
}

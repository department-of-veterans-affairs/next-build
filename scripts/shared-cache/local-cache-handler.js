import { CacheHandler } from '@neshca/cache-handler'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cache directory paths
const CACHE_DIR = path.join(process.cwd(), 'local-cache')
const HTML_EXPORT_DIR = path.join(process.cwd(), 'html-cache')
const NEXT_STATIC_DIR = path.join(process.cwd(), '.next/static')
const EXPORT_STATIC_DIR = path.join(HTML_EXPORT_DIR, '_next/static')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

let staticAssetsCopied = false

// Helper function to create a safe filename from a cache key
function keyToFilename(key) {
  return crypto.createHash('md5').update(key).digest('hex') + '.json'
}

// Helper function to convert cache key to URL path
function keyToUrlPath(key) {
  // Extract URL path from cache key (keys are typically like /page-path or similar)
  const match = key.match(/^\/?(.+)$/)
  return match ? match[1] : key
}

// Ensure cache directories exist
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR)
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true })
  }
  try {
    await fs.access(HTML_EXPORT_DIR)
  } catch {
    await fs.mkdir(HTML_EXPORT_DIR, { recursive: true })
  }
}

// Copy static assets from .next/static and public to html-cache
async function copyStaticAssets() {
  if (staticAssetsCopied) return

  try {
    // Copy .next/static directory
    await fs.access(NEXT_STATIC_DIR)
    await fs.mkdir(EXPORT_STATIC_DIR, { recursive: true })
    await fs.cp(NEXT_STATIC_DIR, EXPORT_STATIC_DIR, { recursive: true })

    // Copy public directory contents (generated, img, etc.)
    const publicItems = await fs.readdir(PUBLIC_DIR)
    for (const item of publicItems) {
      const srcPath = path.join(PUBLIC_DIR, item)
      const destPath = path.join(HTML_EXPORT_DIR, item)

      // Skip if already exists
      try {
        await fs.access(destPath)
        continue
      } catch {
        // Doesn't exist, copy it
      }

      const stat = await fs.stat(srcPath)
      if (stat.isDirectory()) {
        await fs.cp(srcPath, destPath, { recursive: true })
      } else {
        await fs.copyFile(srcPath, destPath)
      }
    }

    staticAssetsCopied = true
  } catch (error) {
    console.error('Error copying static assets:', error)
  }
}

// Export HTML file for nginx serving
async function exportHtml(key, value) {
  try {
    // Check if this is a page cache entry with HTML content
    if (value && value.kind === 'PAGES' && value.html) {
      // Copy static assets once
      await copyStaticAssets()

      const urlPath = keyToUrlPath(key)
      const htmlPath = path.join(HTML_EXPORT_DIR, urlPath, 'index.html')
      const jsonPath = path.join(HTML_EXPORT_DIR, urlPath, 'index.json')

      // Create directory structure
      await fs.mkdir(path.dirname(htmlPath), { recursive: true })

      // Write HTML file
      await fs.writeFile(htmlPath, value.html, 'utf8')

      // Write JSON page data file if pageData exists
      if (value.pageData) {
        await fs.writeFile(jsonPath, JSON.stringify(value.pageData), 'utf8')
      }
    }
  } catch (error) {
    console.error(`Error exporting HTML for key ${key}:`, error)
  }
}

CacheHandler.onCreation(async () => {
  await ensureCacheDir()

  const handler = {
    async get(key) {
      try {
        const filename = keyToFilename(key)
        const filepath = path.join(CACHE_DIR, filename)
        const data = await fs.readFile(filepath, 'utf8')
        return JSON.parse(data)
      } catch (error) {
        // File doesn't exist or can't be read
        return null
      }
    },
    async set(key, data) {
      try {
        const filename = keyToFilename(key)
        const filepath = path.join(CACHE_DIR, filename)
        await fs.writeFile(filepath, JSON.stringify(data), 'utf8')

        // Also export as HTML if applicable
        await exportHtml(key, data.value)
      } catch (error) {
        console.error('Error writing cache file:', error)
      }
    },
    async revalidateTag(tag) {
      try {
        // Read all cache files
        const files = await fs.readdir(CACHE_DIR)

        for (const file of files) {
          if (!file.endsWith('.json')) continue

          const filepath = path.join(CACHE_DIR, file)
          try {
            const data = await fs.readFile(filepath, 'utf8')
            const cacheEntry = JSON.parse(data)

            // If the cache entry has tags that include the specified tag, delete it
            if (cacheEntry.tags && cacheEntry.tags.includes(tag)) {
              await fs.unlink(filepath)
            }
          } catch (error) {
            // Skip files that can't be read or parsed
            console.error(`Error processing cache file ${file}:`, error)
          }
        }
      } catch (error) {
        console.error('Error revalidating tag:', error)
      }
    },
    async delete(key) {
      try {
        const filename = keyToFilename(key)
        const filepath = path.join(CACHE_DIR, filename)
        await fs.unlink(filepath)
      } catch (error) {
        // File doesn't exist or can't be deleted
      }
    },
  }

  return {
    handlers: [handler],
  }
})

export default CacheHandler

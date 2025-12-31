import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import type { ExportedComparisonsData, ExportedComparison } from '@/types/qa'

interface ComparisonRecord {
  env1: string
  env2: string
  selector: string
  timestamp: string
  html1?: string
  html2?: string
  acceptedDifferences?: string[]
  comments?: Record<string, string>
  collapseWhitespace?: boolean
  includeDataTestId?: boolean
}

interface QAPath {
  path: string
  starred?: boolean
  notes?: string
  comparisons?: ComparisonRecord[]
}

interface QACache {
  resourceType: string
  paths: QAPath[]
  lastFetched?: string
}

function getCacheFilePath(resourceType: string): string {
  const cacheDir = path.join(process.cwd(), '.qa-data')
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }
  return path.join(cacheDir, `${resourceType}.json`)
}

function readCache(resourceType: string): QACache | null {
  const filePath = getCacheFilePath(resourceType)
  if (!fs.existsSync(filePath)) {
    return null
  }
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as QACache
  } catch (error) {
    console.error('Error reading cache file:', error)
    return null
  }
}

function writeCache(cache: QACache): void {
  const filePath = getCacheFilePath(cache.resourceType)
  fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf-8')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = req.body as ExportedComparisonsData

    // Validate structure
    if (!data.comparisons || !Array.isArray(data.comparisons)) {
      return res.status(400).json({ error: 'Invalid data structure' })
    }

    // Validate each comparison has required fields
    for (const comp of data.comparisons) {
      if (
        !comp.contentType ||
        !comp.path ||
        !comp.html1 ||
        !comp.html2 ||
        !comp.env1 ||
        !comp.env2 ||
        !comp.selector
      ) {
        return res.status(400).json({
          error:
            'Each comparison must have contentType, path, html1, html2, env1, env2, and selector',
        })
      }
    }

    // Group comparisons by content type and path
    const groupedByContentType = new Map<
      string,
      Map<string, ExportedComparison[]>
    >()

    for (const comp of data.comparisons) {
      if (!groupedByContentType.has(comp.contentType)) {
        groupedByContentType.set(comp.contentType, new Map())
      }
      const pathMap = groupedByContentType.get(comp.contentType)!
      if (!pathMap.has(comp.path)) {
        pathMap.set(comp.path, [])
      }
      pathMap.get(comp.path)!.push(comp)
    }

    // Backup: Read all existing caches first (for rollback)
    const backups = new Map<string, QACache>()
    for (const contentType of groupedByContentType.keys()) {
      const cache = readCache(contentType)
      if (cache) {
        backups.set(contentType, JSON.parse(JSON.stringify(cache)))
      }
    }

    try {
      // Process each content type
      for (const [contentType, pathMap] of groupedByContentType.entries()) {
        let cache = readCache(contentType)

        // If cache doesn't exist, create it with just the imported paths
        if (!cache) {
          const allPaths = Array.from(pathMap.keys())
          cache = {
            resourceType: contentType,
            paths: allPaths.map((path) => ({ path })),
            lastFetched: new Date().toISOString(),
          }
        } else {
          // Clear ALL comparisons from ALL existing paths (complete replacement)
          for (const qaPath of cache.paths) {
            delete qaPath.comparisons
          }
        }

        // Add imported comparisons to appropriate paths
        for (const [pathStr, comparisons] of pathMap.entries()) {
          let pathIndex = cache.paths.findIndex((p) => p.path === pathStr)

          // If path doesn't exist in cache, add it
          if (pathIndex === -1) {
            cache.paths.push({ path: pathStr })
            pathIndex = cache.paths.length - 1
          }

          // Convert exported comparisons to comparison records
          const comparisonRecords: ComparisonRecord[] = comparisons.map(
            (comp) => ({
              env1: comp.env1,
              env2: comp.env2,
              selector: comp.selector,
              timestamp: comp.timestamp,
              html1: comp.html1,
              html2: comp.html2,
              acceptedDifferences: comp.acceptedDifferences || [],
              comments: comp.comments || {},
              collapseWhitespace: comp.collapseWhitespace,
              includeDataTestId: comp.includeDataTestId,
            })
          )

          cache.paths[pathIndex].comparisons = comparisonRecords
        }

        // Write updated cache
        writeCache(cache)
      }

      // Success
      return res.status(200).json({
        success: true,
        message: `Imported ${data.comparisons.length} comparisons`,
      })
    } catch (error) {
      // Rollback: Restore all backups
      console.error('Import failed, rolling back:', error)
      for (const [contentType, backup] of backups.entries()) {
        try {
          writeCache(backup)
        } catch (rollbackError) {
          console.error(`Failed to rollback ${contentType}:`, rollbackError)
        }
      }
      throw error
    }
  } catch (error) {
    console.error('Import API Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while importing comparisons',
    })
  }
}

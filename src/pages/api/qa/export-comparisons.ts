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

function getCacheDirectory(): string {
  return path.join(process.cwd(), '.qa-data')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExportedComparisonsData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cacheDir = getCacheDirectory()

    // Check if cache directory exists
    if (!fs.existsSync(cacheDir)) {
      return res.status(200).json({
        exportedAt: new Date().toISOString(),
        comparisons: [],
      })
    }

    // Read all .json files in the cache directory
    const files = fs.readdirSync(cacheDir).filter((f) => f.endsWith('.json'))

    const allComparisons: ExportedComparison[] = []

    // Process each file
    for (const file of files) {
      const filePath = path.join(cacheDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const cache: QACache = JSON.parse(fileContent)

      // Extract comparisons from each path
      for (const qaPath of cache.paths) {
        if (qaPath.comparisons && qaPath.comparisons.length > 0) {
          for (const comp of qaPath.comparisons) {
            // Only export comparisons that have HTML
            if (comp.html1 && comp.html2) {
              allComparisons.push({
                contentType: cache.resourceType,
                path: qaPath.path,
                env1: comp.env1,
                env2: comp.env2,
                selector: comp.selector,
                timestamp: comp.timestamp,
                html1: comp.html1,
                html2: comp.html2,
                acceptedDifferences: comp.acceptedDifferences || [],
                comments: comp.comments || {},
                collapseWhitespace: comp.collapseWhitespace ?? true,
                includeDataTestId: comp.includeDataTestId ?? false,
              })
            }
          }
        }
      }
    }

    return res.status(200).json({
      exportedAt: new Date().toISOString(),
      comparisons: allComparisons,
    })
  } catch (error) {
    console.error('Export API Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while exporting comparisons',
    })
  }
}

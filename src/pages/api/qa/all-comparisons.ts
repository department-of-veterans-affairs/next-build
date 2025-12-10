import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

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

type AllComparisonsResponse = {
  [contentType: string]: QACache
}

function getCacheDirectory(): string {
  return path.join(process.cwd(), '.qa-data')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AllComparisonsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cacheDir = getCacheDirectory()

    // Check if cache directory exists
    if (!fs.existsSync(cacheDir)) {
      return res.status(200).json({})
    }

    // Read all .json files in the cache directory
    const files = fs.readdirSync(cacheDir).filter((f) => f.endsWith('.json'))

    const allCaches: AllComparisonsResponse = {}

    // Process each file
    for (const file of files) {
      const filePath = path.join(cacheDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const cache: QACache = JSON.parse(fileContent)

      // Only include if there are comparisons
      const hasComparisons = cache.paths.some(
        (p) => p.comparisons && p.comparisons.length > 0
      )

      if (hasComparisons) {
        allCaches[cache.resourceType] = cache
      }
    }

    return res.status(200).json(allCaches)
  } catch (error) {
    console.error('All-comparisons API Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while fetching comparisons',
    })
  }
}

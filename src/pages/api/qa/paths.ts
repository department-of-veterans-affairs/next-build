import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getStaticPathsByResourceType } from '@/lib/drupal/staticPaths'
import { slugToPath } from '@/lib/utils/slug'
import { ResourceType } from '@/lib/constants/resourceTypes'

interface QAPath {
  path: string
  starred?: boolean
  notes?: string
}

interface QACache {
  resourceType: string
  paths: QAPath[]
  lastFetched?: string
}

const getCacheFilePath = (resourceType: string): string => {
  const cacheDir = path.join(process.cwd(), '.qa-data')
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }
  return path.join(cacheDir, `${resourceType}.json`)
}

const readCache = (resourceType: string): QACache | null => {
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

const cleanPath = (qaPath: QAPath): Partial<QAPath> => {
  const cleaned: Partial<QAPath> = { path: qaPath.path }
  if (qaPath.starred === true) {
    cleaned.starred = true
  }
  if (qaPath.notes && qaPath.notes.trim() !== '') {
    cleaned.notes = qaPath.notes
  }
  return cleaned
}

const writeCache = (cache: QACache): void => {
  const filePath = getCacheFilePath(cache.resourceType)
  // Clean paths to only include starred/notes if they have values
  const cleanedCache: QACache = {
    ...cache,
    paths: cache.paths.map(cleanPath) as QAPath[],
  }
  fs.writeFileSync(filePath, JSON.stringify(cleanedCache, null, 2), 'utf-8')
}

const fetchPathsFromDrupal = async (
  resourceType: ResourceType
): Promise<string[]> => {
  const staticPaths = await getStaticPathsByResourceType(resourceType)
  return staticPaths.map((staticPath) => {
    if (typeof staticPath === 'string') {
      return slugToPath(staticPath)
    }
    const slug = staticPath.params.slug
    return slugToPath(slug)
  })
}

const mergePathsWithCache = (
  newPaths: string[],
  existingCache: QACache
): QACache => {
  const existingPathsMap = new Map<string, QAPath>()
  existingCache.paths.forEach((path) => {
    existingPathsMap.set(path.path, path)
  })

  const mergedPaths: QAPath[] = newPaths.map((path) => {
    const existing = existingPathsMap.get(path)
    if (existing) {
      return existing
    }
    return {
      path,
    }
  })

  return {
    resourceType: existingCache.resourceType,
    paths: mergedPaths,
    lastFetched: new Date().toISOString(),
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { resourceType, revalidate } = req.query

      if (!resourceType || typeof resourceType !== 'string') {
        return res.status(400).json({ error: 'Resource type is required' })
      }

      const existingCache = readCache(resourceType)
      const shouldRevalidate = revalidate === 'true'

      // If file exists and we're not revalidating, return from cache
      if (existingCache && !shouldRevalidate) {
        return res.status(200).json(existingCache)
      }

      // Fetch paths from Drupal
      const newPaths = await fetchPathsFromDrupal(resourceType as ResourceType)

      let cache: QACache

      if (existingCache && shouldRevalidate) {
        // Merge new paths with existing cache
        cache = mergePathsWithCache(newPaths, existingCache)
      } else {
        // Create new cache
        cache = {
          resourceType,
          paths: newPaths.map((path) => ({
            path,
          })),
          lastFetched: new Date().toISOString(),
        }
      }

      // Write to file
      writeCache(cache)

      return res.status(200).json(cache)
    } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({
        error: error.message || 'An error occurred while fetching paths',
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { resourceType, path: pathToUpdate, starred, notes } = req.body

      if (!resourceType || !pathToUpdate) {
        return res
          .status(400)
          .json({ error: 'Resource type and path are required' })
      }

      const cache = readCache(resourceType)

      if (!cache) {
        return res.status(404).json({ error: 'Cache not found' })
      }

      // Find and update the path
      const pathIndex = cache.paths.findIndex((p) => p.path === pathToUpdate)

      if (pathIndex === -1) {
        return res.status(404).json({ error: 'Path not found in cache' })
      }

      // Update the path
      if (typeof starred === 'boolean') {
        if (starred) {
          cache.paths[pathIndex].starred = true
        } else {
          delete cache.paths[pathIndex].starred
        }
      }
      if (typeof notes === 'string') {
        if (notes.trim() !== '') {
          cache.paths[pathIndex].notes = notes
        } else {
          delete cache.paths[pathIndex].notes
        }
      }

      // Write back to file
      writeCache(cache)

      return res.status(200).json(cache.paths[pathIndex])
    } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({
        error: error.message || 'An error occurred while updating path',
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

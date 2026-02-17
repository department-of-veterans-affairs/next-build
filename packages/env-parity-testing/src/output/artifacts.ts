import fs from 'fs'
import path from 'path'
import Debug from 'debug'

const debug = Debug('ept:artifacts')

/**
 * Convert a URL path to a safe directory name
 */
export function pathToSlug(urlPath: string): string {
  // Remove leading/trailing slashes, replace remaining slashes with underscores
  return (
    urlPath
      .replace(/^\/+|\/+$/g, '')
      .replace(/\//g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '_') || 'root'
  )
}

/**
 * Ensure a directory exists, creating it if necessary
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    debug(`Creating directory: ${dirPath}`)
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Create the artifacts directory structure for a test run
 */
export function createArtifactsDir(baseDir: string): string {
  const absoluteDir = path.resolve(baseDir)

  // Clear existing artifacts directory
  if (fs.existsSync(absoluteDir)) {
    debug(`Clearing existing artifacts directory: ${absoluteDir}`)
    fs.rmSync(absoluteDir, { recursive: true })
  }

  ensureDir(absoluteDir)
  debug(`Created artifacts directory: ${absoluteDir}`)

  return absoluteDir
}

/**
 * Create artifacts directory for a specific page
 */
export function createPageArtifactsDir(
  baseDir: string,
  urlPath: string
): string {
  const slug = pathToSlug(urlPath)
  const pageDir = path.join(baseDir, slug)
  ensureDir(pageDir)
  return pageDir
}

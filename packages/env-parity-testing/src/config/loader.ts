import fs from 'fs'
import path from 'path'
import { pathToFileURL, fileURLToPath } from 'url'
import type {
  EPTConfig,
  CLIOptions,
  ResolvedConfig,
  PathConfig,
  PathInput,
} from './types.js'
import {
  DEFAULT_EXECUTION,
  DEFAULT_VISUAL,
  DEFAULT_OUTPUT,
  DEFAULT_HOOKS,
} from './defaults.js'

// Get the package root directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = path.resolve(__dirname, '../..')
const DEFAULT_PATHS_FILE = path.join(PACKAGE_ROOT, 'paths/critical.txt')
const DEFAULT_CONFIG_FILE = path.join(PACKAGE_ROOT, 'ept.config.default.ts')
const DEFAULT_ARTIFACTS_DIR = path.join(PACKAGE_ROOT, 'artifacts')

/**
 * Load a TypeScript/JavaScript config file
 */
async function loadConfigFile(configPath: string): Promise<EPTConfig> {
  const absolutePath = path.resolve(configPath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Config file not found: ${absolutePath}`)
  }

  // Use dynamic import with file URL for ESM compatibility
  const fileUrl = pathToFileURL(absolutePath).href
  const module = await import(fileUrl)

  return module.default || module
}

/**
 * Load paths from a text file (one path per line)
 */
function loadPathsFile(pathsFile: string): string[] {
  const absolutePath = path.resolve(pathsFile)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Paths file not found: ${absolutePath}`)
  }

  const content = fs.readFileSync(absolutePath, 'utf-8')
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

/**
 * Build a map of path options from config file
 */
function buildPathOptionsMap(
  configPaths: PathInput[] | undefined
): Map<string, Partial<PathConfig>> {
  const map = new Map<string, Partial<PathConfig>>()

  if (!configPaths) return map

  for (const p of configPaths) {
    if (typeof p === 'string') {
      // Simple string path in config - no special options
      continue
    }
    // Store options keyed by path
    const { path: pathStr, ...options } = p
    map.set(pathStr, options)
  }

  return map
}

/**
 * Merge paths from file with options from config
 */
function mergePathsWithOptions(
  paths: string[],
  optionsMap: Map<string, Partial<PathConfig>>
): PathConfig[] {
  return paths.map((p) => {
    const options = optionsMap.get(p) || {}
    return { path: p, ...options }
  })
}

/**
 * Load and merge configuration from all sources
 *
 * Precedence (highest wins):
 * 1. CLI arguments
 * 2. Config file
 * 3. Built-in defaults
 */
export async function loadConfig(cli: CLIOptions): Promise<ResolvedConfig> {
  // Load config file - use default if none specified
  const configPath = cli.config || DEFAULT_CONFIG_FILE
  let fileConfig: EPTConfig = {}
  if (fs.existsSync(configPath)) {
    fileConfig = await loadConfigFile(configPath)
  }

  // Load paths from file (paths file is the source of truth for WHICH paths)
  const pathsFile = cli.paths || DEFAULT_PATHS_FILE
  const pathStrings = loadPathsFile(pathsFile)

  if (pathStrings.length === 0) {
    throw new Error(
      `No paths found in ${pathsFile}. Add paths to the file (one per line).`
    )
  }

  // Build options map from config file and merge with paths
  const pathOptionsMap = buildPathOptionsMap(fileConfig.paths)
  const paths = mergePathsWithOptions(pathStrings, pathOptionsMap)

  // Resolve environment URLs (CLI overrides config file, then defaults)
  const envAUrl =
    cli.envA || fileConfig.environments?.a?.baseUrl || 'https://www.va.gov'
  const envBUrl =
    cli.envB || fileConfig.environments?.b?.baseUrl || 'https://staging.va.gov'

  // Build resolved config
  const resolved: ResolvedConfig = {
    environments: {
      a: { baseUrl: envAUrl },
      b: { baseUrl: envBUrl },
    },
    paths,
    execution: {
      ...DEFAULT_EXECUTION,
      ...fileConfig.execution,
      ...(cli.failFast !== undefined && { failFast: cli.failFast }),
      ...(cli.concurrency !== undefined && { concurrency: cli.concurrency }),
    },
    visual: {
      ...DEFAULT_VISUAL,
      ...fileConfig.visual,
    },
    output: {
      artifactsDir:
        fileConfig.output?.artifactsDir || cli.output || DEFAULT_ARTIFACTS_DIR,
      reportFile:
        fileConfig.output?.reportFile ||
        path.join(
          fileConfig.output?.artifactsDir ||
            cli.output ||
            DEFAULT_ARTIFACTS_DIR,
          'report.json'
        ),
    },
    hooks: {
      ...DEFAULT_HOOKS,
      ...fileConfig.hooks,
    },
  }

  return resolved
}

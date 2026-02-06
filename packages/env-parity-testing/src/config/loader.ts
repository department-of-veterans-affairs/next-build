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
 * Normalize path inputs to PathConfig objects
 */
function normalizePaths(paths: PathInput[]): PathConfig[] {
  return paths.map((p) => {
    if (typeof p === 'string') {
      return { path: p }
    }
    return p
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
  const fileConfig = await loadConfigFile(configPath)

  // Load paths from file if specified (CLI override), otherwise use config file paths
  let paths: PathInput[] = fileConfig.paths || []
  if (cli.paths) {
    paths = loadPathsFile(cli.paths)
  }

  if (paths.length === 0) {
    throw new Error(
      'No paths configured. Provide paths via config file or --paths option.'
    )
  }

  // Resolve environment URLs (CLI overrides config file)
  const envAUrl = cli.envA || fileConfig.environments?.a?.baseUrl
  const envBUrl = cli.envB || fileConfig.environments?.b?.baseUrl

  if (!envAUrl || !envBUrl) {
    throw new Error(
      'Both environment URLs must be specified in config file or via --envA and --envB options.'
    )
  }

  // Build resolved config
  const resolved: ResolvedConfig = {
    environments: {
      a: { baseUrl: envAUrl },
      b: { baseUrl: envBUrl },
    },
    paths: normalizePaths(paths),
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

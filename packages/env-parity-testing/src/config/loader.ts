import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
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
  // Load config file if specified
  let fileConfig: EPTConfig = {}
  if (cli.config) {
    fileConfig = await loadConfigFile(cli.config)
  }

  // Load paths from file if specified (CLI override)
  let paths: PathInput[] = fileConfig.paths || []
  if (cli.paths) {
    paths = loadPathsFile(cli.paths)
  }

  if (paths.length === 0) {
    throw new Error(
      'No paths configured. Provide paths via config file or --paths option.'
    )
  }

  // Resolve environment URLs
  const envAUrl = cli.envA || fileConfig.environments?.a?.baseUrl
  const envBUrl = cli.envB || fileConfig.environments?.b?.baseUrl

  if (!envAUrl || !envBUrl) {
    throw new Error(
      'Both environment URLs must be specified. Use --envA and --envB options or configure in config file.'
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
      ...DEFAULT_OUTPUT,
      ...fileConfig.output,
      ...(cli.output && { artifactsDir: cli.output }),
    },
    hooks: {
      ...DEFAULT_HOOKS,
      ...fileConfig.hooks,
    },
  }

  return resolved
}

import chalk from 'chalk'
import { parseArgs } from './cli.js'
import { loadConfig } from './config/loader.js'
import { run } from './core/runner.js'

// Re-export types for config file usage
export type { EPTConfig } from './config/types.js'

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    // Parse CLI arguments
    const cliOptions = parseArgs()

    // Load and merge configuration
    const config = await loadConfig(cliOptions)

    // Run comparisons
    const { exitCode } = await run(config)

    process.exit(exitCode)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    console.error(chalk.red(`\nError: ${message}\n`))
    process.exit(2)
  }
}

main()

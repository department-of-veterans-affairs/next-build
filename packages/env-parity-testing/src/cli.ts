import { Command } from 'commander'
import type { CLIOptions } from './config/types.js'

/**
 * Parse CLI arguments and return options
 */
export function parseArgs(): CLIOptions {
  const program = new Command()

  program
    .name('ept')
    .description('Environment Parity Testing - Compare two live environments')
    .version('0.1.0')
    .option('-c, --config <path>', 'Path to config file (ept.config.ts)')
    .option('-p, --paths <path>', 'Path to paths file (one path per line)')
    .option('--envA <url>', 'Base URL for environment A')
    .option('--envB <url>', 'Base URL for environment B')
    .option('--fail-fast', 'Stop on first failure')
    .option('--no-fail-fast', 'Continue after failures (default)')
    .option('--concurrency <n>', 'Number of parallel comparisons', parseInt)
    .option('-o, --output <dir>', 'Artifacts output directory')

  program.parse()

  const opts = program.opts()

  return {
    config: opts.config,
    paths: opts.paths,
    envA: opts.envA,
    envB: opts.envB,
    failFast: opts.failFast,
    concurrency: opts.concurrency,
    output: opts.output,
  }
}

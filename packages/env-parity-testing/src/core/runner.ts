import chalk from 'chalk'
import Debug from 'debug'
import type { ResolvedConfig, PathConfig } from '../config/types.js'
import type {
  PageComparison,
  ComparisonResult,
  ComparisonTool,
  Report,
} from './types.js'
import { HookExecutor } from './hooks.js'
import { visualComparisonTool } from '../tools/visual/index.js'
import { closeBrowser } from '../tools/visual/screenshot.js'
import {
  createArtifactsDir,
  createPageArtifactsDir,
} from '../output/artifacts.js'
import { generateReport, writeReport } from '../output/report.js'

const debug = Debug('ept:runner')

/**
 * Run comparison for a single page
 */
async function comparePage(
  pathConfig: PathConfig,
  config: ResolvedConfig,
  tools: ComparisonTool[],
  artifactsBaseDir: string,
  hookExecutor: HookExecutor
): Promise<PageComparison> {
  const startTime = Date.now()
  const urlA = `${config.environments.a.baseUrl}${pathConfig.path}`
  const urlB = `${config.environments.b.baseUrl}${pathConfig.path}`

  debug(`Comparing: ${pathConfig.path}`)
  console.log(chalk.blue(`  Comparing: ${pathConfig.path}`))

  // Create page-specific artifacts directory
  const pageArtifactsDir = createPageArtifactsDir(
    artifactsBaseDir,
    pathConfig.path
  )

  const hookContext = {
    path: pathConfig.path,
    envA: config.environments.a,
    envB: config.environments.b,
    config,
  }

  // Run beforeComparison hook
  await hookExecutor.beforeComparison(hookContext)

  // Run all comparison tools
  const results: ComparisonResult[] = []
  for (const tool of tools) {
    const result = await tool.compare({
      pathConfig,
      urlA,
      urlB,
      config,
      artifactsDir: pageArtifactsDir,
    })
    results.push(result)

    // Run afterComparison hook for each tool result
    await hookExecutor.afterComparison(result, hookContext)
  }

  const duration = Date.now() - startTime
  const passed = results.every((r) => r.passed)

  // Log result
  if (passed) {
    console.log(chalk.green(`    ✓ Passed (${duration}ms)`))
  } else {
    console.log(chalk.red(`    ✗ Failed (${duration}ms)`))
    for (const result of results) {
      if (!result.passed) {
        console.log(
          chalk.red(
            `      - ${result.tool}: ${result.error || 'diff exceeded threshold'}`
          )
        )
      }
    }
  }

  return {
    path: pathConfig.path,
    urlA,
    urlB,
    results,
    passed,
    duration,
  }
}

/**
 * Process pages with concurrency limit
 */
async function processPages(
  paths: PathConfig[],
  config: ResolvedConfig,
  tools: ComparisonTool[],
  artifactsDir: string,
  hookExecutor: HookExecutor
): Promise<PageComparison[]> {
  const { concurrency, failFast } = config.execution
  const results: PageComparison[] = []
  let hasFailure = false

  // Process in batches based on concurrency
  for (let i = 0; i < paths.length; i += concurrency) {
    if (failFast && hasFailure) {
      debug('Fail-fast enabled, stopping execution')
      break
    }

    const batch = paths.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map((pathConfig) =>
        comparePage(pathConfig, config, tools, artifactsDir, hookExecutor)
      )
    )

    results.push(...batchResults)

    if (batchResults.some((r) => !r.passed)) {
      hasFailure = true
    }
  }

  return results
}

export interface RunResult {
  report: Report
  exitCode: number
}

/**
 * Main execution entry point
 */
export async function run(config: ResolvedConfig): Promise<RunResult> {
  const startTime = Date.now()

  console.log(chalk.bold('\nEnvironment Parity Testing\n'))
  console.log(chalk.gray(`Environment A: ${config.environments.a.baseUrl}`))
  console.log(chalk.gray(`Environment B: ${config.environments.b.baseUrl}`))
  console.log(chalk.gray(`Paths: ${config.paths.length}`))
  console.log(chalk.gray(`Concurrency: ${config.execution.concurrency}`))
  console.log()

  // Initialize
  const artifactsDir = createArtifactsDir(config.output.artifactsDir)
  const hookExecutor = new HookExecutor(config.hooks)

  // Currently only visual comparison is implemented
  const tools: ComparisonTool[] = [visualComparisonTool]

  try {
    // Run comparisons
    const pages = await processPages(
      config.paths,
      config,
      tools,
      artifactsDir,
      hookExecutor
    )

    const duration = Date.now() - startTime

    // Generate and write report
    const report = generateReport(pages, config, duration)
    writeReport(report, config.output.reportFile)

    // Print summary
    console.log()
    console.log(chalk.bold('Summary'))
    console.log(chalk.gray(`  Total:  ${report.summary.total}`))
    console.log(chalk.green(`  Passed: ${report.summary.passed}`))
    if (report.summary.failed > 0) {
      console.log(chalk.red(`  Failed: ${report.summary.failed}`))
    }
    console.log(chalk.gray(`  Duration: ${(duration / 1000).toFixed(2)}s`))
    console.log()
    console.log(chalk.gray(`Report: ${config.output.reportFile}`))
    console.log(chalk.gray(`Artifacts: ${config.output.artifactsDir}`))

    // Determine exit code
    const exitCode = report.summary.failed > 0 ? 1 : 0

    return { report, exitCode }
  } finally {
    // Cleanup browser
    await closeBrowser()
  }
}

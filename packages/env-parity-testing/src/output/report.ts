import fs from 'fs'
import path from 'path'
import type { Report, PageComparison, RunSummary } from '../core/types.js'
import type { ResolvedConfig } from '../config/types.js'
import Debug from 'debug'

const debug = Debug('ept:report')

/**
 * Calculate summary statistics from page comparisons
 */
export function calculateSummary(
  pages: PageComparison[],
  duration: number
): RunSummary {
  const total = pages.length
  const passed = pages.filter((p) => p.passed).length
  const failed = total - passed

  return {
    total,
    passed,
    failed,
    duration,
  }
}

/**
 * Generate a report object from comparison results
 */
export function generateReport(
  pages: PageComparison[],
  config: ResolvedConfig,
  duration: number
): Report {
  return {
    timestamp: new Date().toISOString(),
    environments: {
      a: config.environments.a.baseUrl,
      b: config.environments.b.baseUrl,
    },
    summary: calculateSummary(pages, duration),
    pages,
  }
}

/**
 * Write report to disk as JSON
 */
export function writeReport(report: Report, outputPath: string): void {
  const absolutePath = path.resolve(outputPath)
  const dir = path.dirname(absolutePath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const json = JSON.stringify(report, null, 2)
  fs.writeFileSync(absolutePath, json, 'utf-8')

  debug(`Report written to: ${absolutePath}`)
}

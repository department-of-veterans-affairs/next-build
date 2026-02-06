import type { PathConfig, ResolvedConfig } from '../config/types.js'

/**
 * Visual-specific result data
 */
export interface VisualComparisonData {
  diffPercent: number
  diffPixels: number
  totalPixels: number
  threshold: number
  artifacts: {
    envA: string
    envB: string
    diff: string
  }
}

/**
 * Result from a single comparison tool (e.g., visual diff)
 */
export interface ComparisonResult {
  tool: string
  passed: boolean
  error?: string
  data?: VisualComparisonData
}

/**
 * Result for a single page comparison across all tools
 */
export interface PageComparison {
  path: string
  urlA: string
  urlB: string
  results: ComparisonResult[]
  passed: boolean
  duration: number
}

/**
 * Context passed to comparison tools
 */
export interface ComparisonContext {
  pathConfig: PathConfig
  urlA: string
  urlB: string
  config: ResolvedConfig
  artifactsDir: string
}

/**
 * Interface for pluggable comparison tools
 */
export interface ComparisonTool {
  name: string
  compare(context: ComparisonContext): Promise<ComparisonResult>
}

/**
 * Summary statistics for a test run
 */
export interface RunSummary {
  total: number
  passed: number
  failed: number
  duration: number
}

/**
 * Full report output
 */
export interface Report {
  timestamp: string
  environments: {
    a: string
    b: string
  }
  summary: RunSummary
  pages: PageComparison[]
}

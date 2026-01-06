/**
 * Types for QA comparison export/import functionality
 */

export interface ExportedComparison {
  contentType: string
  path: string
  env1: string
  env2: string
  selector: string
  timestamp: string
  html1: string
  html2: string
  acceptedDifferences: string[]
  comments: Record<string, string>
  collapseWhitespace: boolean
  includeDataTestId: boolean
}

export interface ExportedComparisonsData {
  exportedAt: string
  comparisons: ExportedComparison[]
}

/**
 * Shared types for QA comparison components
 */

import { MatchedPair, DifferenceDetail } from '@/lib/qa/elementMatcher'

// =============================================================================
// Main Component Props
// =============================================================================

export interface SideBySideCompareProps {
  html1: string
  html2: string
  env1Label: string
  env2Label: string
  onAcceptDifference?: (nodeId: string, differenceIndex: number) => void
  onUnacceptDifference?: (nodeId: string, differenceIndex: number) => void
  onAddComment?: (nodeId: string, comment: string) => void
  acceptedDifferences?: string[]
  comments?: Record<string, string>
  onAcceptMultiple: (keys: string[]) => void
  onUnacceptMultiple: (keys: string[]) => void
  initialCollapseWhitespace?: boolean
  initialIncludeDataTestId?: boolean
  onSettingsChange?: (settings: {
    collapseWhitespace: boolean
    includeDataTestId: boolean
  }) => void
}

// =============================================================================
// Note: Context-provided props are now available via:
// - useCompare() from CompareContext
// - useDifferences() from DifferencesContext
// - useUIState() from UIStateContext
// =============================================================================

// =============================================================================
// Header Component Props
// =============================================================================

export interface CompareHeaderProps {
  totalElements: number
  differenceCount: number
  acceptedCount: number
  currentDifferenceIndex: number
  includeAcceptedInNav: boolean
  onIncludeAcceptedChange: (include: boolean) => void
  collapseWhitespace: boolean
  onCollapseWhitespaceChange: (collapse: boolean) => void
  includeDataTestId: boolean
  onIncludeDataTestIdChange: (include: boolean) => void
  onPreviousDifference: () => void
  onNextDifference: () => void
  onAcceptAll: () => void
  onUnacceptAll: () => void
  hasUnacceptedDifferences: boolean
  hasAcceptedDifferences: boolean
}

// =============================================================================
// Tree Node Renderer Props
// =============================================================================

export interface TreeNodeRendererProps {
  match: MatchedPair
  childMatchesByParentKey: Map<string, MatchedPair[]>
  depth: number
}

// =============================================================================
// Node Row Props
// =============================================================================

export interface NodeRowProps {
  match: MatchedPair
  variant: 'opening' | 'closing'
  isHovered: boolean
  hasVisibleDifferences: boolean
  depth: number
}

// =============================================================================
// Difference Panel Props
// =============================================================================

export interface DifferencePanelProps {
  match: MatchedPair
  nodeId: string
  existingComment?: string
}

// =============================================================================
// Difference Item Props
// =============================================================================

export interface DifferenceItemProps {
  difference: DifferenceDetail
  nodeId: string
  differenceIndex: number
}

// =============================================================================
// Comment Form Props
// =============================================================================

export interface CommentFormProps {
  nodeId: string
  existingComment?: string
}

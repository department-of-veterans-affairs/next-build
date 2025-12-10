/**
 * SideBySideCompare - Main component for HTML comparison between environments
 *
 * Renders a side-by-side comparison of two HTML trees, highlighting differences
 * and allowing users to accept/comment on them.
 */

import * as React from 'react'
import { SideBySideCompareProps } from './types'
import { CompareHeader } from './CompareHeader'
import { TreeNodeRenderer } from './TreeNodeRenderer'
import { styles } from './styles'
import {
  CompareProvider,
  DifferencesProvider,
  UIStateProvider,
} from './contexts'
import {
  useComparisonParsing,
  useAcceptanceLogic,
  useDifferenceNavigation,
} from './hooks'

export const SideBySideCompare: React.FC<SideBySideCompareProps> = ({
  html1,
  html2,
  env1Label,
  env2Label,
  onAcceptDifference,
  onUnacceptDifference,
  onAddComment,
  acceptedDifferences = [],
  comments = {},
  onAcceptMultiple,
  onUnacceptMultiple,
  initialCollapseWhitespace,
  initialIncludeDataTestId,
  onSettingsChange,
}) => {
  // ==========================================================================
  // Refs
  // ==========================================================================

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // ==========================================================================
  // State
  // ==========================================================================

  const [hoveredMatchKey, setHoveredMatchKey] = React.useState<string | null>(
    null
  )
  const [includeAcceptedInNav, setIncludeAcceptedInNav] = React.useState(false)
  const [collapseWhitespace, setCollapseWhitespace] = React.useState(
    initialCollapseWhitespace ?? true
  )
  const [includeDataTestId, setIncludeDataTestId] = React.useState(
    initialIncludeDataTestId ?? false
  )
  const [expandedTextNodes, setExpandedTextNodes] = React.useState<Set<string>>(
    new Set()
  )

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Notify parent of settings changes
  React.useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        collapseWhitespace,
        includeDataTestId,
      })
    }
  }, [collapseWhitespace, includeDataTestId, onSettingsChange])

  // ==========================================================================
  // Custom Hooks
  // ==========================================================================

  // Parse HTML and match elements
  const { matchResult, error } = useComparisonParsing({
    html1,
    html2,
    env1Label,
    env2Label,
    collapseWhitespace,
    includeDataTestId,
  })

  // Memoized values
  const acceptedDifferencesSet = React.useMemo(
    () => new Set(acceptedDifferences),
    [acceptedDifferences]
  )

  const commentsMap = React.useMemo(
    () => new Map(Object.entries(comments)),
    [comments]
  )

  // Acceptance logic and calculations
  const {
    handleAcceptAll,
    handleUnacceptAll,
    hasUnacceptedDifferences,
    hasAcceptedDifferences,
    acceptedCount,
  } = useAcceptanceLogic({
    matchResult,
    acceptedDifferencesSet,
    onAcceptMultiple,
    onUnacceptMultiple,
  })

  // ==========================================================================
  // Text Node Expansion Handler
  // ==========================================================================

  const handleToggleTextExpansion = React.useCallback((matchKey: string) => {
    setExpandedTextNodes((prev) => {
      const next = new Set(prev)
      if (next.has(matchKey)) {
        next.delete(matchKey)
      } else {
        next.add(matchKey)
      }
      return next
    })
  }, [])

  // ==========================================================================
  // Difference Navigation
  // ==========================================================================

  const { currentIndex, totalCount, goToNext, goToPrev } =
    useDifferenceNavigation(scrollContainerRef)

  // ==========================================================================
  // Context Values
  // ==========================================================================

  const compareContextValue = React.useMemo(
    () => ({
      env1Label,
      env2Label,
      onAcceptDifference,
      onUnacceptDifference,
      onAddComment,
    }),
    [
      env1Label,
      env2Label,
      onAcceptDifference,
      onUnacceptDifference,
      onAddComment,
    ]
  )

  const differencesContextValue = React.useMemo(
    () => ({
      acceptedDifferencesSet,
      commentsMap,
      includeAcceptedInNav,
    }),
    [acceptedDifferencesSet, commentsMap, includeAcceptedInNav]
  )

  const uiStateContextValue = React.useMemo(
    () => ({
      hoveredMatchKey,
      onHoverMatchKey: setHoveredMatchKey,
      expandedTextNodes,
      onToggleTextExpansion: handleToggleTextExpansion,
    }),
    [hoveredMatchKey, expandedTextNodes, handleToggleTextExpansion]
  )

  // ==========================================================================
  // Render
  // ==========================================================================

  // Error state
  if (error) {
    return (
      <div className={styles.error}>
        <span className={styles.errorTitle}>Error:</span> {error}
      </div>
    )
  }

  // Loading state
  if (!matchResult) {
    return <div className={styles.loading}>Loading comparison...</div>
  }

  return (
    <CompareProvider value={compareContextValue}>
      <DifferencesProvider value={differencesContextValue}>
        <UIStateProvider value={uiStateContextValue}>
          <div className={styles.compareContainer}>
            {/* Header with navigation */}
            <CompareHeader
              totalElements={matchResult.matches.length}
              differenceCount={totalCount}
              acceptedCount={acceptedCount}
              currentDifferenceIndex={totalCount > 0 ? currentIndex + 1 : 0}
              includeAcceptedInNav={includeAcceptedInNav}
              onIncludeAcceptedChange={setIncludeAcceptedInNav}
              collapseWhitespace={collapseWhitespace}
              onCollapseWhitespaceChange={setCollapseWhitespace}
              includeDataTestId={includeDataTestId}
              onIncludeDataTestIdChange={setIncludeDataTestId}
              onPreviousDifference={goToPrev}
              onNextDifference={goToNext}
              onAcceptAll={handleAcceptAll}
              onUnacceptAll={handleUnacceptAll}
              hasUnacceptedDifferences={hasUnacceptedDifferences}
              hasAcceptedDifferences={hasAcceptedDifferences}
            />

            {/* Comparison View Wrapper */}
            <div className={styles.compareViewWrapper}>
              {/* Column Headers - Outside scroll container */}
              <div className={styles.compareColumnHeaders}>
                <div className={styles.compareColumnHeader}>{env1Label}</div>
                <div className={styles.treeRowDivider} />
                <div className={styles.compareColumnHeader}>{env2Label}</div>
              </div>

              {/* Scrollable Content */}
              <div
                ref={scrollContainerRef}
                className={styles.compareScrollContainer}
              >
                {/* Tree Rendering */}
                {matchResult.rootMatches.map((rootMatch) => {
                  // Use both left and right matchKeys to ensure uniqueness
                  const leftKey = rootMatch.left?.node?.matchKey ?? ''
                  const rightKey = rootMatch.right?.node?.matchKey ?? ''
                  const matchKey = `${leftKey}|${rightKey}`

                  return (
                    <TreeNodeRenderer
                      key={matchKey}
                      match={rootMatch}
                      childMatchesByParentKey={
                        matchResult.childMatchesByParentKey
                      }
                      depth={0}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </UIStateProvider>
      </DifferencesProvider>
    </CompareProvider>
  )
}

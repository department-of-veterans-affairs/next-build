/**
 * SideBySideCompare - Main component for HTML comparison between environments
 *
 * Renders a side-by-side comparison of two HTML trees, highlighting differences
 * and allowing users to accept/comment on them.
 */

import * as React from 'react'
import { SideBySideCompareProps } from './types'
import { CompareHeader } from './CompareHeader'
import { TreeNodeRenderer, getNavigableDifferences } from './TreeNodeRenderer'
import { styles } from './styles'
import {
  CompareProvider,
  DifferencesProvider,
  UIStateProvider,
} from './contexts'
import {
  useComparisonParsing,
  useNavigationState,
  useAcceptanceLogic,
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
}) => {
  // ==========================================================================
  // State
  // ==========================================================================

  const [hoveredMatchKey, setHoveredMatchKey] = React.useState<string | null>(
    null
  )
  const [includeAcceptedInNav, setIncludeAcceptedInNav] = React.useState(false)
  const [collapseWhitespace, setCollapseWhitespace] = React.useState(true)
  const [includeDataTestId, setIncludeDataTestId] = React.useState(false)
  const [expandedTextNodes, setExpandedTextNodes] = React.useState<Set<string>>(
    new Set()
  )

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

  // Get list of navigable differences
  const navigableDifferences = React.useMemo(() => {
    if (!matchResult) return []
    return getNavigableDifferences(
      matchResult.matches,
      acceptedDifferencesSet,
      includeAcceptedInNav
    )
  }, [matchResult, acceptedDifferencesSet, includeAcceptedInNav])

  const differenceCount = navigableDifferences.length

  // Build a set of navigable difference indices for quick lookup
  const navigableDifferenceIndices = React.useMemo(() => {
    const set = new Set<number>()
    navigableDifferences.forEach((nd) => set.add(nd.matchIndex))
    return set
  }, [navigableDifferences])

  // Navigation state and handlers
  const {
    scrollContainerRef,
    currentDifferenceIndex,
    minVisibleDepth,
    handleScroll,
    goToNextDifference,
    goToPreviousDifference,
    registerDifferenceRef,
  } = useNavigationState({
    navigableDifferences,
    differenceCount,
  })

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
    }),
    [acceptedDifferencesSet, commentsMap]
  )

  const uiStateContextValue = React.useMemo(
    () => ({
      hoveredMatchKey,
      onHoverMatchKey: setHoveredMatchKey,
      minVisibleDepth,
      expandedTextNodes,
      onToggleTextExpansion: handleToggleTextExpansion,
    }),
    [
      hoveredMatchKey,
      minVisibleDepth,
      expandedTextNodes,
      handleToggleTextExpansion,
    ]
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
              differenceCount={differenceCount}
              acceptedCount={acceptedCount}
              currentDifferenceIndex={currentDifferenceIndex}
              includeAcceptedInNav={includeAcceptedInNav}
              onIncludeAcceptedChange={setIncludeAcceptedInNav}
              collapseWhitespace={collapseWhitespace}
              onCollapseWhitespaceChange={setCollapseWhitespace}
              includeDataTestId={includeDataTestId}
              onIncludeDataTestIdChange={setIncludeDataTestId}
              onPreviousDifference={goToPreviousDifference}
              onNextDifference={goToNextDifference}
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
                onScroll={handleScroll}
                className={styles.compareScrollContainer}
              >
                {/* Tree Rendering */}
                {matchResult.rootMatches.map((rootMatch) => {
                  const matchKey =
                    rootMatch.left?.node?.matchKey ??
                    rootMatch.right?.node?.matchKey ??
                    ''

                  return (
                    <TreeNodeRenderer
                      key={matchKey}
                      match={rootMatch}
                      childMatchesByParentKey={
                        matchResult.childMatchesByParentKey
                      }
                      depth={0}
                      navigableDifferenceIndices={navigableDifferenceIndices}
                      allMatches={matchResult.matches}
                      registerDifferenceRef={registerDifferenceRef}
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

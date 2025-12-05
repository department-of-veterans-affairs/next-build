/**
 * TreeNodeRenderer - Recursively renders tree nodes with opening tags, children, and closing tags
 */

import * as React from 'react'
import { MatchedPair, isElementNode } from '@/lib/qa/elementMatcher'
import { TreeNodeRendererProps } from './types'
import { NodeRow } from './NodeRow'
import { DifferencePanel } from './DifferencePanel'
import { useCompare, useDifferences, useUIState } from './contexts'

const TreeNodeRendererComponent: React.FC<TreeNodeRendererProps> = ({
  match,
  childMatchesByParentKey,
  depth,
  rowRef,
  // For child navigation
  navigableDifferenceIndices,
  allMatches,
  registerDifferenceRef,
}) => {
  // Get values from contexts
  const {
    env1Label,
    env2Label,
    onAcceptDifference,
    onUnacceptDifference,
    onAddComment,
  } = useCompare()
  const { acceptedDifferencesSet, commentsMap } = useDifferences()
  const {
    hoveredMatchKey,
    onHoverMatchKey,
    minVisibleDepth,
    expandedTextNodes,
    onToggleTextExpansion,
  } = useUIState()

  const leftNode = match.left?.node
  const rightNode = match.right?.node
  const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
  const nodeDepth = leftNode?.depth ?? rightNode?.depth ?? 0

  // Get children for this node
  const children = childMatchesByParentKey.get(matchKey) || []

  // Check if either side is an element with children for closing tag
  const leftHasChildren =
    leftNode && isElementNode(leftNode) && leftNode.children.length > 0
  const rightHasChildren =
    rightNode && isElementNode(rightNode) && rightNode.children.length > 0
  const hasChildren = leftHasChildren || rightHasChildren || children.length > 0

  // Calculate display depth relative to minimum visible depth
  const normalizedDepth = Math.max(0, nodeDepth - minVisibleDepth)

  // Determine if hovered
  const isHovered = hoveredMatchKey === matchKey

  // Determine if has visible differences (for highlighting)
  const hasVisibleDifferences =
    !match.isChildOfMissing &&
    match.differences.some((_, idx) => {
      const key = `${matchKey}:${idx}`
      return !acceptedDifferencesSet.has(key)
    })

  // Get existing comment
  const nodeId = matchKey || `row-${nodeDepth}`
  const existingComment = commentsMap.get(nodeId)

  // Determine whether to show the difference panel
  const shouldShowDifferencePanel =
    !match.isChildOfMissing && (match.differences.length > 0 || existingComment)

  // Check if this specific match is navigable and needs a ref
  const currentMatchIndex = allMatches?.findIndex(
    (m) => (m.left?.node?.matchKey ?? m.right?.node?.matchKey) === matchKey
  )
  const shouldRegisterRef =
    currentMatchIndex !== undefined &&
    currentMatchIndex >= 0 &&
    navigableDifferenceIndices?.has(currentMatchIndex)
  const currentRowRef =
    shouldRegisterRef && registerDifferenceRef
      ? registerDifferenceRef(currentMatchIndex)
      : rowRef

  return (
    <div ref={currentRowRef} data-row-depth={nodeDepth}>
      {/* Opening tag row */}
      <NodeRow
        match={match}
        variant="opening"
        isHovered={isHovered}
        hasVisibleDifferences={hasVisibleDifferences}
        depth={normalizedDepth}
      />

      {/* Difference panel (if any) */}
      {shouldShowDifferencePanel && (
        <DifferencePanel
          match={match}
          nodeId={nodeId}
          existingComment={existingComment}
        />
      )}

      {/* Children (recursive) */}
      {children.map((childMatch) => {
        const childKey =
          childMatch.left?.node?.matchKey ??
          childMatch.right?.node?.matchKey ??
          ''
        return (
          <TreeNodeRenderer
            key={childKey}
            match={childMatch}
            childMatchesByParentKey={childMatchesByParentKey}
            depth={depth + 1}
            navigableDifferenceIndices={navigableDifferenceIndices}
            allMatches={allMatches}
            registerDifferenceRef={registerDifferenceRef}
          />
        )
      })}

      {/* Closing tag (if element with children) */}
      {hasChildren && (
        <NodeRow
          match={match}
          variant="closing"
          isHovered={isHovered}
          hasVisibleDifferences={false} // Closing tags don't show differences
          depth={normalizedDepth}
        />
      )}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders when context values change
export const TreeNodeRenderer = React.memo(TreeNodeRendererComponent)

// =============================================================================
// Helper to get navigable differences (for scroll navigation)
// =============================================================================

export interface NavigableDifference {
  match: MatchedPair
  matchIndex: number
}

export function getNavigableDifferences(
  matches: MatchedPair[],
  acceptedDifferencesSet: Set<string>,
  includeAccepted: boolean
): NavigableDifference[] {
  return matches
    .map((match, idx) => ({ match, matchIndex: idx }))
    .filter(({ match }) => {
      if (!match.isDifferent) return false

      // Don't include children of missing parents in navigation
      if (match.isChildOfMissing) return false

      // If not including accepted differences, filter them out
      if (!includeAccepted) {
        const leftNode = match.left?.node
        const rightNode = match.right?.node
        const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
        const nodeId =
          matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`

        // Check if all differences are accepted
        const allAccepted = match.differences.every((_, idx) => {
          const key = `${nodeId}:${idx}`
          return acceptedDifferencesSet.has(key)
        })

        return !allAccepted
      }

      return true
    })
}

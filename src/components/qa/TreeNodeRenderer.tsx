/**
 * TreeNodeRenderer - Recursively renders tree nodes with opening tags, children, and closing tags
 */

import * as React from 'react'
import { isElementNode } from '@/lib/qa/icm'
import { TreeNodeRendererProps } from './types'
import { NodeRow } from './NodeRow'
import { DifferencePanel } from './DifferencePanel'
import { useDifferences, useUIState } from './contexts'

const TreeNodeRendererComponent: React.FC<TreeNodeRendererProps> = ({
  match,
  childMatchesByParentKey,
  depth,
}) => {
  // Get values from contexts
  const { acceptedDifferencesSet, commentsMap } = useDifferences()
  const { hoveredMatchKey } = useUIState()

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

  // Determine if hovered
  const isHovered = hoveredMatchKey === matchKey

  // Get existing comment
  const nodeId = matchKey || `row-${nodeDepth}`
  const existingComment = commentsMap.get(nodeId)

  // Check if all differences on this node are accepted
  const allDifferencesAccepted =
    match.differences.length > 0 &&
    match.differences.every((_, idx) => {
      const key = `${nodeId}:${idx}`
      return acceptedDifferencesSet.has(key)
    })

  // Determine if has visible (unaccepted) differences - for highlighting
  const hasVisibleDifferences =
    !match.isChildOfMissing &&
    match.differences.length > 0 &&
    !allDifferencesAccepted

  // Determine whether to show the difference panel
  const shouldShowDifferencePanel =
    !match.isChildOfMissing && (match.differences.length > 0 || existingComment)

  return (
    <div
      data-nodeid={nodeId}
      data-diffid={shouldShowDifferencePanel ? nodeId : undefined}
    >
      {/* Opening tag row */}
      <NodeRow
        match={match}
        variant="opening"
        isHovered={isHovered}
        hasVisibleDifferences={hasVisibleDifferences}
        depth={nodeDepth}
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
        // Use both left and right matchKeys to ensure uniqueness
        // (elements can shift positions between left/right, causing key collisions)
        const leftKey = childMatch.left?.node?.matchKey ?? ''
        const rightKey = childMatch.right?.node?.matchKey ?? ''
        const childKey = `${leftKey}|${rightKey}`
        return (
          <TreeNodeRenderer
            key={childKey}
            match={childMatch}
            childMatchesByParentKey={childMatchesByParentKey}
            depth={depth + 1}
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
          depth={nodeDepth}
        />
      )}
    </div>
  )
}

// Memoize to prevent unnecessary re-renders when context values change
export const TreeNodeRenderer = React.memo(TreeNodeRendererComponent)

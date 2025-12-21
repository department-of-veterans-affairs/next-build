/**
 * NodeRow - Renders a single row with left and right tree cells (opening or closing tags)
 */

import * as React from 'react'
import { HtmlTreeNode } from '@/lib/qa/htmlTreeParser'
import { isElementNode, isTextNode } from '@/lib/qa/icm'
import { NodeRowProps } from './types'
import { cx, styles } from './styles'
import { useUIState } from './contexts'

// =============================================================================
// Tree Cell Component
// =============================================================================

interface TreeCellProps {
  node: HtmlTreeNode | null | undefined
  variant: 'opening' | 'closing'
  isHovered: boolean
  hasVisibleDifferences: boolean
  isChildOfMissing: boolean
  onHoverMatchKey: (matchKey: string | null) => void
  matchKey: string
  depth: number
  expandedTextNodes: Set<string>
  onToggleTextExpansion: (matchKey: string) => void
}

const TreeCell: React.FC<TreeCellProps> = ({
  node,
  variant,
  isHovered,
  hasVisibleDifferences,
  isChildOfMissing,
  onHoverMatchKey,
  matchKey,
  depth,
  expandedTextNodes,
  onToggleTextExpansion,
}) => {
  const margin = `2px 4px 2px ${depth * 10}px`

  // Handle missing nodes
  if (!node) {
    // Show red highlighting only if this is a parent (not a child of missing) with visible differences
    const showRedHighlight = !isChildOfMissing && hasVisibleDifferences

    return (
      <div
        className={cx('cell', {
          missing: !showRedHighlight,
          missingHighlighted: showRedHighlight,
        })}
        style={{ margin }}
      >
        <span
          className={cx('missingText', {
            highlighted: showRedHighlight,
            muted: !showRedHighlight,
          })}
        >
          (missing)
        </span>
      </div>
    )
  }

  // Handle closing tags
  if (variant === 'closing') {
    if (!isElementNode(node)) {
      // Text nodes don't have closing tags
      return <div className={cx('cell', { empty: true })} style={{ margin }} />
    }

    return (
      <div
        onMouseEnter={() => onHoverMatchKey(matchKey)}
        onMouseLeave={() => onHoverMatchKey(null)}
        className={cx('cell', { hovered: isHovered })}
        style={{ margin }}
      >
        <span className={cx('tagBracket', { closing: true })}>
          &lt;/{node.tagName}&gt;
        </span>
      </div>
    )
  }

  // Handle text nodes (opening)
  if (isTextNode(node)) {
    const isExpanded = expandedTextNodes.has(matchKey)
    const isTruncated = node.textContent.length > 300
    const displayText =
      isTruncated && !isExpanded
        ? node.textContent.substring(0, 300) + '...'
        : node.textContent

    return (
      <div
        onMouseEnter={() => onHoverMatchKey(matchKey)}
        onMouseLeave={() => onHoverMatchKey(null)}
        className={cx('cell', {
          hovered: isHovered,
          different: hasVisibleDifferences,
        })}
        style={{ margin }}
      >
        <span className={styles.textContent}>
          &quot;{displayText}&quot;
          {isTruncated && (
            <a
              className={styles.showMoreLink}
              onClick={(e) => {
                e.stopPropagation()
                onToggleTextExpansion(matchKey)
              }}
            >
              {isExpanded ? 'show less' : 'show more'}
            </a>
          )}
        </span>
      </div>
    )
  }

  // Handle element nodes (opening)
  if (isElementNode(node)) {
    return (
      <div
        onMouseEnter={() => onHoverMatchKey(matchKey)}
        onMouseLeave={() => onHoverMatchKey(null)}
        className={cx('cell', {
          hovered: isHovered,
          different: hasVisibleDifferences,
        })}
        style={{ margin }}
      >
        <div className={styles.tagWrapper}>
          <span className={styles.tagBracket}>&lt;{node.tagName}</span>
          {Object.entries(node.attributes).map(([key, value]) => {
            const displayValue =
              value.length > 200 ? value.substring(0, 200) + '...' : value
            return (
              <span key={key} className={styles.tagAttr}>
                <span className={styles.tagAttrName}>{key}</span>
                <span className={styles.tagAttrEquals}>=</span>
                <span
                  className={styles.tagAttrValue}
                  title={value !== displayValue ? value : undefined}
                >
                  &quot;{displayValue}&quot;
                </span>
              </span>
            )
          })}
          <span className={styles.tagBracket}>&gt;</span>
        </div>
      </div>
    )
  }

  return null
}

// =============================================================================
// NodeRow Component
// =============================================================================

const NodeRowComponent: React.FC<NodeRowProps> = ({
  match,
  variant,
  isHovered,
  hasVisibleDifferences,
  depth,
}) => {
  const { onHoverMatchKey, expandedTextNodes, onToggleTextExpansion } =
    useUIState()

  const leftNode = match.left?.node
  const rightNode = match.right?.node
  const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''

  return (
    <div className={styles.treeRow}>
      <TreeCell
        node={leftNode}
        variant={variant}
        isHovered={isHovered}
        hasVisibleDifferences={hasVisibleDifferences}
        isChildOfMissing={match.isChildOfMissing}
        onHoverMatchKey={onHoverMatchKey}
        matchKey={matchKey}
        depth={depth}
        expandedTextNodes={expandedTextNodes}
        onToggleTextExpansion={onToggleTextExpansion}
      />
      <div className={styles.treeRowDivider} />
      <TreeCell
        node={rightNode}
        variant={variant}
        isHovered={isHovered}
        hasVisibleDifferences={hasVisibleDifferences}
        isChildOfMissing={match.isChildOfMissing}
        onHoverMatchKey={onHoverMatchKey}
        matchKey={matchKey}
        depth={depth}
        expandedTextNodes={expandedTextNodes}
        onToggleTextExpansion={onToggleTextExpansion}
      />
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export const NodeRow = React.memo(NodeRowComponent)

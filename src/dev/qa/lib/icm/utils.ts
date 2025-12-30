/**
 * ICM Utility Functions
 *
 * Provides helper functions for the matching algorithm including:
 * - Levenshtein distance/similarity
 * - Tree navigation (parent, sibling, child lookups)
 * - Attribute comparison helpers
 * - Node type guards
 * - Difference computation
 */

import type {
  FlatNode,
  HtmlTreeNode,
  ElementNode,
  TextNode,
  DifferenceDetail,
  MatchingState,
} from './types'
import { pathsEqual } from './types'

// =============================================================================
// Type Guards
// =============================================================================

export function isElementNode(node: HtmlTreeNode): node is ElementNode {
  return node.type === 'element'
}

export function isTextNode(node: HtmlTreeNode): node is TextNode {
  return node.type === 'text'
}

// =============================================================================
// Levenshtein Distance / Similarity
// =============================================================================

/**
 * Computes Levenshtein distance between two strings.
 * Standard dynamic programming implementation.
 * O(n*m) time and O(min(n,m)) space.
 */
export function levenshteinDistance(a: string, b: string): number {
  // Early exits
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // Use shorter string for column to save space
  if (a.length > b.length) {
    ;[a, b] = [b, a]
  }

  const aLen = a.length
  const bLen = b.length

  // Previous and current row
  let prevRow = new Array<number>(aLen + 1)
  let currRow = new Array<number>(aLen + 1)

  // Initialize first row
  for (let i = 0; i <= aLen; i++) {
    prevRow[i] = i
  }

  // Fill in the rest
  for (let j = 1; j <= bLen; j++) {
    currRow[0] = j

    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      currRow[i] = Math.min(
        prevRow[i] + 1, // deletion
        currRow[i - 1] + 1, // insertion
        prevRow[i - 1] + cost // substitution
      )
    }

    // Swap rows
    ;[prevRow, currRow] = [currRow, prevRow]
  }

  return prevRow[aLen]
}

/**
 * Computes Levenshtein similarity as a ratio 0-1.
 * 1 means identical, 0 means completely different.
 */
export function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1
  if (!a || !b) return 0

  const maxLen = Math.max(a.length, b.length)
  const distance = levenshteinDistance(a, b)
  return 1 - distance / maxLen
}

// =============================================================================
// Tree Navigation
// =============================================================================

/**
 * Gets the parent's index in the flat node array.
 * Parent path is the node's path with the last element removed.
 */
export function getParentIndex(
  node: FlatNode,
  allNodes: FlatNode[]
): number | null {
  if (node.path.length === 0) return null

  const parentPath = node.path.slice(0, -1)
  const parent = allNodes.find((n) => pathsEqual(n.path, parentPath))
  return parent?.index ?? null
}

/**
 * Gets the previous sibling's index.
 * Previous sibling has the same parent path but path index is one less.
 */
export function getPreviousSiblingIndex(
  node: FlatNode,
  allNodes: FlatNode[]
): number | null {
  if (node.path.length === 0) return null

  const lastIdx = node.path[node.path.length - 1]
  if (lastIdx === 0) return null

  const siblingPath = [...node.path.slice(0, -1), lastIdx - 1]
  const sibling = allNodes.find((n) => pathsEqual(n.path, siblingPath))
  return sibling?.index ?? null
}

/**
 * Gets the next sibling's index.
 * Next sibling has the same parent path but path index is one more.
 */
export function getNextSiblingIndex(
  node: FlatNode,
  allNodes: FlatNode[]
): number | null {
  if (node.path.length === 0) return null

  const lastIdx = node.path[node.path.length - 1]
  const siblingPath = [...node.path.slice(0, -1), lastIdx + 1]
  const sibling = allNodes.find((n) => pathsEqual(n.path, siblingPath))
  return sibling?.index ?? null
}

/**
 * Gets indices of all direct children of a node.
 * Direct children have paths that are one level deeper and share the parent path.
 */
export function getChildIndices(
  node: FlatNode,
  allNodes: FlatNode[]
): number[] {
  const childIndices: number[] = []
  const nodePath = node.path

  for (const other of allNodes) {
    // Check if other is a direct child (one level deeper, shares parent path)
    if (
      other.path.length === nodePath.length + 1 &&
      nodePath.every((v, i) => v === other.path[i])
    ) {
      childIndices.push(other.index)
    }
  }

  return childIndices
}

/**
 * Checks if ancestor is an ancestor of descendant based on paths.
 */
export function isAncestor(ancestor: FlatNode, descendant: FlatNode): boolean {
  const aPath = ancestor.path
  const dPath = descendant.path

  if (aPath.length >= dPath.length) return false

  return aPath.every((v, i) => v === dPath[i])
}

// =============================================================================
// Attribute Comparison
// =============================================================================

/**
 * Computes overlap ratio between two attribute sets.
 * Excludes specified attributes (like 'class').
 * Returns 0-1 ratio where 1 is complete overlap.
 */
export function computeAttributeOverlap(
  left: Record<string, string>,
  right: Record<string, string>,
  exclude: string[] = []
): number {
  const excludeSet = new Set(exclude)

  const leftKeys = Object.keys(left).filter((k) => !excludeSet.has(k))
  const rightKeys = Object.keys(right).filter((k) => !excludeSet.has(k))

  if (leftKeys.length === 0 && rightKeys.length === 0) return 1

  const allKeys = new Set([...leftKeys, ...rightKeys])
  if (allKeys.size === 0) return 1

  let matches = 0
  for (const key of allKeys) {
    if (left[key] === right[key]) {
      matches++
    }
  }

  return matches / allKeys.size
}

/**
 * Computes overlap ratio between two class strings.
 * Returns 0-1 ratio where 1 is complete overlap.
 */
export function computeClassOverlap(
  leftClasses: string | undefined,
  rightClasses: string | undefined
): number {
  const leftSet = new Set(
    leftClasses
      ?.split(/\s+/)
      .filter(Boolean)
      .map((c) => c.toLowerCase()) ?? []
  )
  const rightSet = new Set(
    rightClasses
      ?.split(/\s+/)
      .filter(Boolean)
      .map((c) => c.toLowerCase()) ?? []
  )

  if (leftSet.size === 0 && rightSet.size === 0) return 1
  if (leftSet.size === 0 || rightSet.size === 0) return 0

  // Count intersection
  let intersection = 0
  for (const cls of leftSet) {
    if (rightSet.has(cls)) {
      intersection++
    }
  }

  // Jaccard similarity: intersection / union
  const union = leftSet.size + rightSet.size - intersection
  return intersection / union
}

// =============================================================================
// Node Comparison
// =============================================================================

/**
 * Compares two nodes for equality.
 * Used to determine if matched nodes have differences.
 */
export function areNodesEqual(
  left: HtmlTreeNode,
  right: HtmlTreeNode
): boolean {
  if (left.type !== right.type) return false

  if (isTextNode(left) && isTextNode(right)) {
    return left.textContent === right.textContent
  }

  if (isElementNode(left) && isElementNode(right)) {
    if (left.tagName !== right.tagName) return false

    const leftAttrs = left.attributes
    const rightAttrs = right.attributes

    const leftKeys = Object.keys(leftAttrs).sort()
    const rightKeys = Object.keys(rightAttrs).sort()

    if (leftKeys.length !== rightKeys.length) return false

    for (let i = 0; i < leftKeys.length; i++) {
      if (leftKeys[i] !== rightKeys[i]) return false
      if (leftAttrs[leftKeys[i]] !== rightAttrs[rightKeys[i]]) return false
    }

    return true
  }

  return false
}

/**
 * Gets detailed differences between two nodes.
 * Used for rendering difference descriptions in the UI.
 */
export function getNodeDifferences(
  left: HtmlTreeNode | null,
  right: HtmlTreeNode | null,
  env1Label: string = 'left pane',
  env2Label: string = 'right pane'
): DifferenceDetail[] {
  const differences: DifferenceDetail[] = []

  // Missing node
  if (!left) {
    const rightValue = right
      ? isElementNode(right)
        ? right.tagName
        : right.textContent
      : undefined
    differences.push({
      type: 'missing',
      description: `Element exists only in ${env2Label}`,
      rightValue,
    })
    return differences
  }

  if (!right) {
    const leftValue = isElementNode(left) ? left.tagName : left.textContent
    differences.push({
      type: 'missing',
      description: `Element exists only in ${env1Label}`,
      leftValue,
    })
    return differences
  }

  // Different types
  if (left.type !== right.type) {
    differences.push({
      type: 'tag',
      description: 'Different node types',
      leftValue: left.type,
      rightValue: right.type,
    })
    return differences
  }

  // Text nodes
  if (isTextNode(left) && isTextNode(right)) {
    if (left.textContent !== right.textContent) {
      differences.push({
        type: 'text',
        description: 'Different text content',
        leftValue: left.textContent,
        rightValue: right.textContent,
      })
    }
    return differences
  }

  // Element nodes
  if (isElementNode(left) && isElementNode(right)) {
    // Tag name
    if (left.tagName !== right.tagName) {
      differences.push({
        type: 'tag',
        description: 'Different tag names',
        leftValue: left.tagName,
        rightValue: right.tagName,
      })
    }

    // Attributes
    const leftAttrs = left.attributes
    const rightAttrs = right.attributes
    const allAttrKeys = new Set([
      ...Object.keys(leftAttrs),
      ...Object.keys(rightAttrs),
    ])

    for (const key of allAttrKeys) {
      const leftVal = leftAttrs[key]
      const rightVal = rightAttrs[key]

      if (leftVal !== rightVal) {
        differences.push({
          type: 'attribute',
          description: `Attribute "${key}" differs`,
          leftValue: leftVal || '(missing)',
          rightValue: rightVal || '(missing)',
        })
      }
    }
  }

  return differences
}

// =============================================================================
// Child Match Ratio
// =============================================================================

/**
 * Computes what ratio of a left node's children are matched to a right node's children.
 * Used for context propagation - if children match, parents are more likely to match.
 */
export function computeChildMatchRatio(
  leftNode: FlatNode,
  rightNode: FlatNode,
  state: MatchingState
): number {
  const leftChildIndices = getChildIndices(leftNode, state.leftNodes)
  const rightChildIndices = new Set(
    getChildIndices(rightNode, state.rightNodes)
  )

  if (leftChildIndices.length === 0) return 0

  let matchedChildren = 0
  for (const leftChildIdx of leftChildIndices) {
    const assignedRightIdx = state.assignments.get(leftChildIdx)
    if (
      assignedRightIdx !== undefined &&
      rightChildIndices.has(assignedRightIdx)
    ) {
      matchedChildren++
    }
  }

  return matchedChildren / leftChildIndices.length
}

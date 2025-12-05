/**
 * Element Matcher
 *
 * Matches elements from two HTML trees using intelligent heuristics.
 * Elements are matched by ID, classes, attributes, and position.
 * Returns a rich result structure with pre-computed differences for rendering.
 */

import {
  HtmlTreeNode,
  ElementNode,
  TextNode,
  FlatNode,
  ParsedHtmlTree,
  pathToString,
  pathsEqual,
} from './htmlTreeParser'

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
// Difference Types
// =============================================================================

export interface DifferenceDetail {
  type: 'attribute' | 'tag' | 'text' | 'children' | 'missing'
  description: string
  leftValue?: string
  rightValue?: string
}

// =============================================================================
// Matched Pair
// =============================================================================

export interface MatchedPair {
  left: FlatNode | null
  right: FlatNode | null
  /** Confidence score 0-1, where 1 is perfect match */
  matchConfidence: number
  /** Whether the nodes have any differences */
  isDifferent: boolean
  /** True if this node is a child of a parent that's already missing */
  isChildOfMissing: boolean
  /** Pre-computed differences (empty if not different) */
  differences: DifferenceDetail[]
}

// =============================================================================
// Match Result (for recursive rendering)
// =============================================================================

export interface MatchResult {
  /** All matched pairs in depth-first order */
  matches: MatchedPair[]
  /** Only top-level (root) matches for starting recursive rendering */
  rootMatches: MatchedPair[]
  /** Map from parent matchKey to its child matches */
  childMatchesByParentKey: Map<string, MatchedPair[]>
}

// =============================================================================
// Node Comparison
// =============================================================================

/**
 * Compares two nodes for equality
 */
function areNodesEqual(left: HtmlTreeNode, right: HtmlTreeNode): boolean {
  // Different types
  if (left.type !== right.type) return false

  // Text nodes
  if (isTextNode(left) && isTextNode(right)) {
    return left.textContent === right.textContent
  }

  // Element nodes
  if (isElementNode(left) && isElementNode(right)) {
    if (left.tagName !== right.tagName) return false

    // Compare attributes
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
 * Gets detailed differences between two nodes
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
// Main Matching Algorithm
// =============================================================================

/**
 * Matches elements from two HTML trees using intelligent heuristics.
 *
 * @param leftTree - Parsed left tree
 * @param rightTree - Parsed right tree
 * @param env1Label - Label for left environment (for difference descriptions)
 * @param env2Label - Label for right environment (for difference descriptions)
 * @returns MatchResult with matches, rootMatches, and childMatchesByParentKey
 */
export function matchElements(
  leftTree: ParsedHtmlTree,
  rightTree: ParsedHtmlTree,
  env1Label: string = 'left pane',
  env2Label: string = 'right pane'
): MatchResult {
  const leftFlat = leftTree.flatNodes
  const rightFlat = rightTree.flatNodes

  const result: MatchedPair[] = []
  const usedRightIndices = new Set<number>()

  // Track missing parent paths for isChildOfMissing calculation
  const missingLeftPaths = new Set<string>()
  const missingRightPaths = new Set<string>()

  // First pass: match by ID (strongest signal)
  for (const leftNode of leftFlat) {
    const leftNodeEl = isElementNode(leftNode.node) ? leftNode.node : null
    if (leftNodeEl && leftNodeEl.id) {
      const rightMatch = rightFlat.find(
        (r) =>
          isElementNode(r.node) &&
          r.node.id === leftNodeEl.id &&
          !usedRightIndices.has(r.index)
      )
      if (rightMatch) {
        usedRightIndices.add(rightMatch.index)
        const isDifferent = !areNodesEqual(leftNode.node, rightMatch.node)
        result.push({
          left: leftNode,
          right: rightMatch,
          matchConfidence: 1.0,
          isDifferent,
          isChildOfMissing: false,
          differences: isDifferent
            ? getNodeDifferences(
                leftNode.node,
                rightMatch.node,
                env1Label,
                env2Label
              )
            : [],
        })
      }
    }
  }

  // Second pass: match by matchKey (tag + classes + important attributes)
  for (const leftNode of leftFlat) {
    if (result.some((r) => r.left?.index === leftNode.index)) continue

    const rightMatch = rightFlat.find(
      (r) =>
        r.node.matchKey === leftNode.node.matchKey &&
        !usedRightIndices.has(r.index)
    )
    if (rightMatch) {
      usedRightIndices.add(rightMatch.index)
      const isDifferent = !areNodesEqual(leftNode.node, rightMatch.node)
      result.push({
        left: leftNode,
        right: rightMatch,
        matchConfidence: 0.8,
        isDifferent,
        isChildOfMissing: false,
        differences: isDifferent
          ? getNodeDifferences(
              leftNode.node,
              rightMatch.node,
              env1Label,
              env2Label
            )
          : [],
      })
    }
  }

  // Third pass: match by tag name and relative position
  for (const leftNode of leftFlat) {
    if (result.some((r) => r.left?.index === leftNode.index)) continue

    // Special handling for text nodes
    if (isTextNode(leftNode.node)) {
      // For text nodes, find candidates where the parent elements are already matched
      const leftParentPath = leftNode.path.slice(0, -1)

      // Find the parent element's match
      const parentMatch = result.find(
        (r) => r.left && pathsEqual(r.left.path, leftParentPath)
      )

      if (parentMatch && parentMatch.right) {
        // Parent is matched, find text node children of the matched right parent
        const rightParentPath = parentMatch.right.path

        const candidates = rightFlat.filter((r) => {
          if (!isTextNode(r.node) || usedRightIndices.has(r.index)) return false

          // Check if this right node is a child of the matched right parent
          const rParentPath = r.path.slice(0, -1)
          if (!pathsEqual(rParentPath, rightParentPath)) return false

          // Must be at same depth
          if (r.node.depth !== leftNode.node.depth) return false

          return true
        })

        if (candidates.length > 0) {
          // Prefer text nodes with similar content type (whitespace vs non-whitespace)
          const leftText = leftNode.node.textContent.trim()
          const leftIsWhitespace = leftText === ''

          let rightMatch = candidates.find((c) => {
            if (!isTextNode(c.node)) return false
            const rightText = c.node.textContent.trim()
            const rightIsWhitespace = rightText === ''
            return leftIsWhitespace === rightIsWhitespace
          })

          if (!rightMatch) {
            rightMatch = candidates[0]
          }

          usedRightIndices.add(rightMatch.index)
          const isDifferent = !areNodesEqual(leftNode.node, rightMatch.node)
          result.push({
            left: leftNode,
            right: rightMatch,
            matchConfidence: 0.5,
            isDifferent,
            isChildOfMissing: false,
            differences: isDifferent
              ? getNodeDifferences(
                  leftNode.node,
                  rightMatch.node,
                  env1Label,
                  env2Label
                )
              : [],
          })
          continue
        }
      }
    }

    // For element nodes, find candidates with same tag name at similar depth
    if (isElementNode(leftNode.node)) {
      const leftElNode = leftNode.node // TypeScript now knows this is ElementNode
      const candidates = rightFlat.filter(
        (r) =>
          isElementNode(r.node) &&
          r.node.tagName === leftElNode.tagName &&
          r.node.depth === leftElNode.depth &&
          !usedRightIndices.has(r.index)
      )

      if (candidates.length > 0) {
        const rightMatch = candidates[0]
        usedRightIndices.add(rightMatch.index)
        const isDifferent = !areNodesEqual(leftNode.node, rightMatch.node)
        result.push({
          left: leftNode,
          right: rightMatch,
          matchConfidence: 0.5,
          isDifferent,
          isChildOfMissing: false,
          differences: isDifferent
            ? getNodeDifferences(
                leftNode.node,
                rightMatch.node,
                env1Label,
                env2Label
              )
            : [],
        })
      }
    }
  }

  // Fourth pass: add unmatched left nodes (deletions)
  for (const leftNode of leftFlat) {
    if (result.some((r) => r.left?.index === leftNode.index)) continue

    const pathStr = pathToString(leftNode.path)

    // Check if any ancestor is already marked as missing
    const isChildOfMissing = [...missingLeftPaths].some((mp) =>
      pathStr.startsWith(mp + '/')
    )

    // Only track as missing parent if not already a child of missing
    if (!isChildOfMissing) {
      missingLeftPaths.add(pathStr)
    }

    result.push({
      left: leftNode,
      right: null,
      matchConfidence: 0,
      isDifferent: true,
      isChildOfMissing,
      differences: getNodeDifferences(
        leftNode.node,
        null,
        env1Label,
        env2Label
      ),
    })
  }

  // Fifth pass: add unmatched right nodes (additions)
  for (const rightNode of rightFlat) {
    if (usedRightIndices.has(rightNode.index)) continue

    const pathStr = pathToString(rightNode.path)

    // Check if any ancestor is already marked as missing
    const isChildOfMissing = [...missingRightPaths].some((mp) =>
      pathStr.startsWith(mp + '/')
    )

    // Only track as missing parent if not already a child of missing
    if (!isChildOfMissing) {
      missingRightPaths.add(pathStr)
    }

    result.push({
      left: null,
      right: rightNode,
      matchConfidence: 0,
      isDifferent: true,
      isChildOfMissing,
      differences: getNodeDifferences(
        null,
        rightNode.node,
        env1Label,
        env2Label
      ),
    })
  }

  // Sort to maintain depth-first traversal order
  result.sort((a, b) => {
    const aPath = a.left?.path ?? a.right?.path ?? []
    const bPath = b.left?.path ?? b.right?.path ?? []

    // Compare paths element by element (lexicographic order)
    const minLen = Math.min(aPath.length, bPath.length)
    for (let i = 0; i < minLen; i++) {
      if (aPath[i] !== bPath[i]) {
        return aPath[i] - bPath[i]
      }
    }

    // If one path is a prefix of the other, shorter one comes first
    if (aPath.length !== bPath.length) {
      return aPath.length - bPath.length
    }

    // If paths are identical, prefer left nodes
    if (a.left && !b.left) return -1
    if (!a.left && b.left) return 1

    return 0
  })

  // Build childMatchesByParentKey map for recursive rendering
  const childMatchesByParentKey = new Map<string, MatchedPair[]>()
  const rootMatches: MatchedPair[] = []

  for (const match of result) {
    const node = match.left?.node ?? match.right?.node
    if (!node) continue

    const parentKey = node.parentMatchKey

    if (!parentKey) {
      // This is a root node
      rootMatches.push(match)
    } else {
      // Add to parent's children
      if (!childMatchesByParentKey.has(parentKey)) {
        childMatchesByParentKey.set(parentKey, [])
      }
      childMatchesByParentKey.get(parentKey)!.push(match)
    }
  }

  return {
    matches: result,
    rootMatches,
    childMatchesByParentKey,
  }
}

/**
 * Element Matcher
 *
 * Matches elements from two HTML trees using intelligent heuristics.
 * Elements are matched by ID, classes, attributes, and position.
 * Returns a rich result structure with pre-computed differences for rendering.
 *
 * Performance: Optimized from O(n²) to O(n) complexity using hash map indices.
 * - Pre-builds lookup maps for O(1) node access
 * - Tracks matched nodes with Sets instead of array searches
 * - Uses path hierarchy checks instead of string matching
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
// Performance Optimization Helpers
// =============================================================================

/**
 * Lookup indices for efficient node matching.
 * Pre-computing these indices reduces O(n²) operations to O(n).
 */
interface NodeIndices {
  byId: Map<string, FlatNode>
  byMatchKey: Map<string, FlatNode[]>
  byTagAndDepth: Map<string, FlatNode[]>
  textNodesByParentPath: Map<string, FlatNode[]>
}

/**
 * Builds lookup indices for efficient node matching.
 * Single O(m) pass enables O(1) lookups in subsequent matching passes.
 */
function buildNodeIndices(flatNodes: FlatNode[]): NodeIndices {
  const byId = new Map<string, FlatNode>()
  const byMatchKey = new Map<string, FlatNode[]>()
  const byTagAndDepth = new Map<string, FlatNode[]>()
  const textNodesByParentPath = new Map<string, FlatNode[]>()

  for (const node of flatNodes) {
    // Index by ID (for Pass 1: ID matching)
    if (isElementNode(node.node) && node.node.id) {
      byId.set(node.node.id, node)
    }

    // Index by matchKey (for Pass 2: MatchKey matching)
    const matchKey = node.node.matchKey
    if (!byMatchKey.has(matchKey)) {
      byMatchKey.set(matchKey, [])
    }
    byMatchKey.get(matchKey)!.push(node)

    // Index elements by tag+depth (for Pass 3: Position matching)
    if (isElementNode(node.node)) {
      const key = `${node.node.tagName}:${node.node.depth}`
      if (!byTagAndDepth.has(key)) {
        byTagAndDepth.set(key, [])
      }
      byTagAndDepth.get(key)!.push(node)
    }

    // Index text nodes by parent path (for Pass 3: Text node matching)
    if (isTextNode(node.node)) {
      const parentPath = pathToString(node.path.slice(0, -1))
      if (!textNodesByParentPath.has(parentPath)) {
        textNodesByParentPath.set(parentPath, [])
      }
      textNodesByParentPath.get(parentPath)!.push(node)
    }
  }

  return { byId, byMatchKey, byTagAndDepth, textNodesByParentPath }
}

/**
 * Creates a matched pair with pre-computed differences.
 * Reduces code duplication across matching passes.
 */
function createMatchedPair(
  left: FlatNode | null,
  right: FlatNode | null,
  matchConfidence: number,
  isChildOfMissing: boolean,
  env1Label: string,
  env2Label: string
): MatchedPair {
  const isDifferent =
    left && right ? !areNodesEqual(left.node, right.node) : true

  return {
    left,
    right,
    matchConfidence,
    isDifferent,
    isChildOfMissing,
    differences: isDifferent
      ? getNodeDifferences(
          left?.node ?? null,
          right?.node ?? null,
          env1Label,
          env2Label
        )
      : [],
  }
}

/**
 * Checks if a node's ancestor is in the missing set.
 * Walks up the path hierarchy instead of string matching for O(d) complexity.
 */
function isChildOfMissingNode(
  nodePath: number[],
  missingIndices: Set<number>,
  allNodes: FlatNode[]
): boolean {
  // Check each ancestor path from immediate parent up to root
  for (let depth = nodePath.length - 1; depth > 0; depth--) {
    const ancestorPath = nodePath.slice(0, depth)
    const ancestor = allNodes.find((n) => pathsEqual(n.path, ancestorPath))
    if (ancestor && missingIndices.has(ancestor.index)) {
      return true
    }
  }
  return false
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

  // === INITIALIZATION ===
  // Pre-build indices for O(1) lookups instead of O(n) finds
  const rightIndices = buildNodeIndices(rightFlat)

  const result: MatchedPair[] = []
  const usedRightIndices = new Set<number>()
  const matchedLeftIndices = new Set<number>()

  // Track missing parent indices for isChildOfMissing calculation
  const missingLeftIndices = new Set<number>()
  const missingRightIndices = new Set<number>()

  // === PASS 1: ID Matching ===
  // Strongest signal: match by ID attribute. O(n) with hash lookup.
  for (const leftNode of leftFlat) {
    const leftNodeEl = isElementNode(leftNode.node) ? leftNode.node : null
    if (leftNodeEl && leftNodeEl.id) {
      const rightMatch = rightIndices.byId.get(leftNodeEl.id)
      if (rightMatch && !usedRightIndices.has(rightMatch.index)) {
        usedRightIndices.add(rightMatch.index)
        matchedLeftIndices.add(leftNode.index)
        result.push(
          createMatchedPair(
            leftNode,
            rightMatch,
            1.0,
            false,
            env1Label,
            env2Label
          )
        )
      }
    }
  }

  // === PASS 2: MatchKey Matching ===
  // Match by tag + classes + attributes. O(n) with indexed candidates.
  for (const leftNode of leftFlat) {
    if (matchedLeftIndices.has(leftNode.index)) continue

    const candidates = rightIndices.byMatchKey.get(leftNode.node.matchKey) || []
    const rightMatch = candidates.find((c) => !usedRightIndices.has(c.index))

    if (rightMatch) {
      usedRightIndices.add(rightMatch.index)
      matchedLeftIndices.add(leftNode.index)
      result.push(
        createMatchedPair(
          leftNode,
          rightMatch,
          0.8,
          false,
          env1Label,
          env2Label
        )
      )
    }
  }

  // === PASS 3: Position/Tag Matching ===
  // Fallback: match by structure and position. O(n × c) where c is small.

  // Build map for quick parent match lookup
  const leftMatchByPath = new Map<string, MatchedPair>()
  for (const match of result) {
    if (match.left) {
      leftMatchByPath.set(pathToString(match.left.path), match)
    }
  }

  for (const leftNode of leftFlat) {
    if (matchedLeftIndices.has(leftNode.index)) continue

    // Special handling for text nodes
    if (isTextNode(leftNode.node)) {
      // For text nodes, find candidates where the parent elements are already matched
      const leftParentPath = pathToString(leftNode.path.slice(0, -1))

      // Find the parent element's match using O(1) lookup
      const parentMatch = leftMatchByPath.get(leftParentPath)

      if (parentMatch && parentMatch.right) {
        // Parent is matched, find text node children of the matched right parent
        const rightParentPath = pathToString(parentMatch.right.path)

        const candidates =
          rightIndices.textNodesByParentPath.get(rightParentPath) || []
        const unusedCandidates = candidates.filter(
          (c) =>
            !usedRightIndices.has(c.index) &&
            c.node.depth === leftNode.node.depth
        )

        if (unusedCandidates.length > 0) {
          // Prefer text nodes with similar content type (whitespace vs non-whitespace)
          const leftText = leftNode.node.textContent.trim()
          const leftIsWhitespace = leftText === ''

          let rightMatch = unusedCandidates.find((c) => {
            if (!isTextNode(c.node)) return false
            const rightText = c.node.textContent.trim()
            const rightIsWhitespace = rightText === ''
            return leftIsWhitespace === rightIsWhitespace
          })

          if (!rightMatch) {
            rightMatch = unusedCandidates[0]
          }

          usedRightIndices.add(rightMatch.index)
          matchedLeftIndices.add(leftNode.index)
          result.push(
            createMatchedPair(
              leftNode,
              rightMatch,
              0.5,
              false,
              env1Label,
              env2Label
            )
          )
          continue
        }
      }
    }

    // For element nodes, find candidates with same tag name at similar depth
    if (isElementNode(leftNode.node)) {
      const key = `${leftNode.node.tagName}:${leftNode.node.depth}`
      const candidates = rightIndices.byTagAndDepth.get(key) || []
      const unusedCandidates = candidates.filter(
        (c) => !usedRightIndices.has(c.index)
      )

      if (unusedCandidates.length > 0) {
        const rightMatch = unusedCandidates[0]
        usedRightIndices.add(rightMatch.index)
        matchedLeftIndices.add(leftNode.index)
        result.push(
          createMatchedPair(
            leftNode,
            rightMatch,
            0.5,
            false,
            env1Label,
            env2Label
          )
        )
      }
    }
  }

  // === PASS 4: Unmatched Left Nodes ===
  // Track deletions with parent hierarchy checks. O(n × d) where d is tree depth.
  for (const leftNode of leftFlat) {
    if (matchedLeftIndices.has(leftNode.index)) continue

    // Check if any ancestor is already marked as missing
    const isChildOfMissing = isChildOfMissingNode(
      leftNode.path,
      missingLeftIndices,
      leftFlat
    )

    // Only track as missing parent if not already a child of missing
    if (!isChildOfMissing) {
      missingLeftIndices.add(leftNode.index)
    }

    result.push(
      createMatchedPair(
        leftNode,
        null,
        0,
        isChildOfMissing,
        env1Label,
        env2Label
      )
    )
  }

  // === PASS 5: Unmatched Right Nodes ===
  // Track additions with parent hierarchy checks. O(m × d) where d is tree depth.
  for (const rightNode of rightFlat) {
    if (usedRightIndices.has(rightNode.index)) continue

    // Check if any ancestor is already marked as missing
    const isChildOfMissing = isChildOfMissingNode(
      rightNode.path,
      missingRightIndices,
      rightFlat
    )

    // Only track as missing parent if not already a child of missing
    if (!isChildOfMissing) {
      missingRightIndices.add(rightNode.index)
    }

    result.push(
      createMatchedPair(
        null,
        rightNode,
        0,
        isChildOfMissing,
        env1Label,
        env2Label
      )
    )
  }

  // === FINALIZATION ===
  // Sort matches for depth-first traversal and build parent-child relationships
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

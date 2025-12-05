import { HtmlTreeNode, FlatNode, flattenTree } from './htmlTreeParser'

export interface MatchedPair {
  left: FlatNode | null
  right: FlatNode | null
  matchConfidence: number // 0-1, where 1 is perfect match
  isDifferent: boolean
}

/**
 * Matches elements from two HTML trees using intelligent heuristics.
 * Elements are matched by ID, classes, attributes, and position.
 */
export function matchElements(
  leftTree: HtmlTreeNode,
  rightTree: HtmlTreeNode
): MatchedPair[] {
  const leftFlat = flattenTree(leftTree)
  const rightFlat = flattenTree(rightTree)

  const result: MatchedPair[] = []
  const usedRightIndices = new Set<number>()

  // First pass: match by ID (strongest signal)
  for (const leftNode of leftFlat) {
    if (leftNode.node.id) {
      const rightMatch = rightFlat.find(
        (r) => r.node.id === leftNode.node.id && !usedRightIndices.has(r.index)
      )
      if (rightMatch) {
        usedRightIndices.add(rightMatch.index)
        result.push({
          left: leftNode,
          right: rightMatch,
          matchConfidence: 1.0,
          isDifferent: !areNodesEqual(leftNode.node, rightMatch.node),
        })
      }
    }
  }

  // Second pass: match by matchKey (tag + classes + important attributes)
  for (const leftNode of leftFlat) {
    if (result.some((r) => r.left?.index === leftNode.index)) continue // Already matched

    const rightMatch = rightFlat.find(
      (r) =>
        r.node.matchKey === leftNode.node.matchKey &&
        !usedRightIndices.has(r.index)
    )
    if (rightMatch) {
      usedRightIndices.add(rightMatch.index)
      result.push({
        left: leftNode,
        right: rightMatch,
        matchConfidence: 0.8,
        isDifferent: !areNodesEqual(leftNode.node, rightMatch.node),
      })
    }
  }

  // Third pass: match by tag name and relative position
  for (const leftNode of leftFlat) {
    if (result.some((r) => r.left?.index === leftNode.index)) continue // Already matched

    // Find candidates with same tag name at similar depth
    const candidates = rightFlat.filter(
      (r) =>
        r.node.tagName === leftNode.node.tagName &&
        r.node.depth === leftNode.node.depth &&
        !usedRightIndices.has(r.index)
    )

    if (candidates.length > 0) {
      // Use the closest one by index (simple heuristic)
      const rightMatch = candidates[0]
      usedRightIndices.add(rightMatch.index)
      result.push({
        left: leftNode,
        right: rightMatch,
        matchConfidence: 0.5,
        isDifferent: !areNodesEqual(leftNode.node, rightMatch.node),
      })
    }
  }

  // Fourth pass: add unmatched left nodes (deletions)
  for (const leftNode of leftFlat) {
    if (result.some((r) => r.left?.index === leftNode.index)) continue
    result.push({
      left: leftNode,
      right: null,
      matchConfidence: 0,
      isDifferent: true, // Missing on right side
    })
  }

  // Fifth pass: add unmatched right nodes (additions)
  for (const rightNode of rightFlat) {
    if (usedRightIndices.has(rightNode.index)) continue
    result.push({
      left: null,
      right: rightNode,
      matchConfidence: 0,
      isDifferent: true, // Missing on left side
    })
  }

  // Sort to maintain depth-first traversal order
  // Use path-based comparison when possible, falling back to indices
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

  return result
}

/**
 * Compares two nodes for equality
 */
function areNodesEqual(left: HtmlTreeNode, right: HtmlTreeNode): boolean {
  // Different types
  if (left.type !== right.type) return false

  // Text nodes
  if (left.type === 'text') {
    return left.textContent === right.textContent
  }

  // Element nodes
  if (left.tagName !== right.tagName) return false

  // Compare attributes
  const leftAttrs = left.attributes || {}
  const rightAttrs = right.attributes || {}

  const leftKeys = Object.keys(leftAttrs).sort()
  const rightKeys = Object.keys(rightAttrs).sort()

  if (leftKeys.length !== rightKeys.length) return false

  for (let i = 0; i < leftKeys.length; i++) {
    if (leftKeys[i] !== rightKeys[i]) return false
    if (leftAttrs[leftKeys[i]] !== rightAttrs[rightKeys[i]]) return false
  }

  // Compare number of children
  const leftChildCount = left.children?.length || 0
  const rightChildCount = right.children?.length || 0

  if (leftChildCount !== rightChildCount) return false

  return true
}

export interface DifferenceDetail {
  type: 'attribute' | 'tag' | 'text' | 'children' | 'missing'
  description: string
  leftValue?: string
  rightValue?: string
}

/**
 * Gets detailed differences between two nodes
 */
export function getNodeDifferences(
  left: HtmlTreeNode | null,
  right: HtmlTreeNode | null
): DifferenceDetail[] {
  const differences: DifferenceDetail[] = []

  // Missing node
  if (!left) {
    differences.push({
      type: 'missing',
      description: 'Element exists only in right pane',
      rightValue: right?.tagName || right?.textContent,
    })
    return differences
  }

  if (!right) {
    differences.push({
      type: 'missing',
      description: 'Element exists only in left pane',
      leftValue: left?.tagName || left?.textContent,
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
  if (left.type === 'text') {
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

  // Element tag name
  if (left.tagName !== right.tagName) {
    differences.push({
      type: 'tag',
      description: 'Different tag names',
      leftValue: left.tagName,
      rightValue: right.tagName,
    })
  }

  // Attributes
  const leftAttrs = left.attributes || {}
  const rightAttrs = right.attributes || {}
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

  // Children count
  const leftChildCount = left.children?.length || 0
  const rightChildCount = right.children?.length || 0

  if (leftChildCount !== rightChildCount) {
    differences.push({
      type: 'children',
      description: 'Different number of children',
      leftValue: String(leftChildCount),
      rightValue: String(rightChildCount),
    })
  }

  return differences
}

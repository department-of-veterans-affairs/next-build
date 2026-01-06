/**
 * ICM (Iterative Consensus Matching) - Main Entry Point
 *
 * A robust HTML element matching algorithm that uses:
 * - Iterative context propagation (parent/sibling/child relationships)
 * - Anchor-based recovery (using high-confidence matches as reference points)
 *
 * Key improvement over previous algorithm: classes are weighted very low,
 * so differing CSS classes don't cause structural mismatches.
 */

/* eslint-disable no-console */
// Console logging is intentional for this QA debugging tool

import type {
  ParsedHtmlTree,
  MatchResult,
  MatchedPair,
  FlatNode,
  MatchingState,
} from './types'
import {
  DEFAULT_WEIGHTS,
  MAX_ITERATIONS,
  MINIMUM_MATCH_THRESHOLD,
} from './types'
import { buildCandidateGraph } from './similarity'
import { propagateContext } from './contextPropagation'
import { anchorRecovery } from './anchorRecovery'
import { greedyAssignment, initializeState } from './assignment'
import { areNodesEqual, getNodeDifferences, isAncestor } from './utils'

// =============================================================================
// Main Entry Point
// =============================================================================

/**
 * Matches elements from two HTML trees using Iterative Consensus Matching.
 *
 * Algorithm:
 * 1. Build candidate graph with base similarity scores
 * 2. Iteratively:
 *    a. Perform greedy assignment
 *    b. Propagate context (boost scores based on parent/sibling/child matches)
 *    c. Run anchor recovery (re-score regions between high-confidence matches)
 * 3. Repeat until convergence or max iterations
 * 4. Build final MatchResult in the format expected by the UI
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
  const startTime = performance.now()
  console.log('ICM: Starting matching...')
  console.log(
    `ICM: Left tree has ${leftTree.flatNodes.length} nodes, right tree has ${rightTree.flatNodes.length} nodes`
  )

  // Initialize state
  const state = initializeState(leftTree.flatNodes, rightTree.flatNodes)

  // Phase 1: Build candidate graph with base similarity scores
  console.log('ICM: Building candidate graph...')
  buildCandidateGraph(state, DEFAULT_WEIGHTS)

  let totalCandidates = 0
  for (const candidates of state.candidates.values()) {
    totalCandidates += candidates.length
  }
  console.log(
    `ICM: Built candidate graph with ${totalCandidates} total candidates`
  )

  // Phase 2 & 3: Iterative refinement
  let convergedAt = MAX_ITERATIONS
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    state.iteration = i

    // Make assignments based on current scores
    greedyAssignment(state)

    // Propagate context from current assignments
    const contextChanged = propagateContext(state, DEFAULT_WEIGHTS)

    // Anchor-based recovery
    const anchorsChanged = anchorRecovery(state, DEFAULT_WEIGHTS)

    // Log progress every 10 iterations or on significant changes
    if (i % 10 === 0 || (!contextChanged && !anchorsChanged)) {
      console.log(
        `ICM: Iteration ${i + 1} - ${state.anchors.size} anchors, ${state.assignments.size} assignments`
      )
    }

    // Check convergence
    if (!contextChanged && !anchorsChanged) {
      convergedAt = i + 1
      console.log(`ICM: Converged after ${convergedAt} iterations`)
      break
    }
  }

  if (convergedAt === MAX_ITERATIONS) {
    console.log(`ICM: Reached max iterations (${MAX_ITERATIONS})`)
  }

  // Final assignment
  greedyAssignment(state)

  // Phase 4: Build output in MatchResult format
  const result = buildMatchResult(state, env1Label, env2Label)

  const elapsed = performance.now() - startTime
  console.log(
    `ICM: Complete. ${result.matches.length} matches in ${elapsed.toFixed(0)}ms`
  )

  return result
}

// =============================================================================
// Result Building
// =============================================================================

/**
 * Builds the MatchResult from the final state.
 * Creates MatchedPair objects for all matched and unmatched nodes.
 */
function buildMatchResult(
  state: MatchingState,
  env1Label: string,
  env2Label: string
): MatchResult {
  const matches: MatchedPair[] = []

  // Track which nodes have been included
  const includedLeftIndices = new Set<number>()
  const includedRightIndices = new Set<number>()

  // Track missing parent indices for isChildOfMissing calculation
  const missingLeftIndices = new Set<number>()
  const missingRightIndices = new Set<number>()

  // First pass: Add all matched pairs
  for (const [leftIndex, rightIndex] of state.assignments) {
    const leftNode = state.leftNodes[leftIndex]
    const rightNode = state.rightNodes[rightIndex]

    // Calculate confidence (normalize score to 0-1 range)
    const candidate = state.candidates
      .get(leftIndex)
      ?.find((c) => c.rightIndex === rightIndex)
    const rawScore = candidate?.totalScore ?? MINIMUM_MATCH_THRESHOLD
    // Normalize: assume max useful score is around 150
    const matchConfidence = Math.min(1, rawScore / 150)

    const isDifferent = !areNodesEqual(leftNode.node, rightNode.node)

    matches.push({
      left: leftNode,
      right: rightNode,
      matchConfidence,
      isDifferent,
      isChildOfMissing: false, // Matched nodes are not missing
      differences: isDifferent
        ? getNodeDifferences(
            leftNode.node,
            rightNode.node,
            env1Label,
            env2Label
          )
        : [],
    })

    includedLeftIndices.add(leftIndex)
    includedRightIndices.add(rightIndex)
  }

  // Second pass: Add unmatched left nodes (deletions)
  for (const leftNode of state.leftNodes) {
    if (includedLeftIndices.has(leftNode.index)) continue

    // Check if any ancestor is already missing
    const isChildOfMissing = isChildOfMissingNode(
      leftNode,
      missingLeftIndices,
      state.leftNodes
    )

    // Track as missing if not already a child of missing
    if (!isChildOfMissing) {
      missingLeftIndices.add(leftNode.index)
    }

    matches.push({
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

  // Third pass: Add unmatched right nodes (additions)
  for (const rightNode of state.rightNodes) {
    if (includedRightIndices.has(rightNode.index)) continue

    // Check if any ancestor is already missing
    const isChildOfMissing = isChildOfMissingNode(
      rightNode,
      missingRightIndices,
      state.rightNodes
    )

    // Track as missing if not already a child of missing
    if (!isChildOfMissing) {
      missingRightIndices.add(rightNode.index)
    }

    matches.push({
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

  // Sort matches for depth-first traversal
  sortMatchesByPath(matches)

  // Build parent-child relationships for recursive rendering
  const { rootMatches, childMatchesByParentKey } = buildHierarchy(matches)

  return {
    matches,
    rootMatches,
    childMatchesByParentKey,
  }
}

/**
 * Checks if a node is a child of a missing node.
 */
function isChildOfMissingNode(
  node: FlatNode,
  missingIndices: Set<number>,
  allNodes: FlatNode[]
): boolean {
  for (const otherNode of allNodes) {
    if (missingIndices.has(otherNode.index)) {
      if (isAncestor(otherNode, node)) {
        return true
      }
    }
  }
  return false
}

/**
 * Sorts matches by path for depth-first traversal.
 */
function sortMatchesByPath(matches: MatchedPair[]): void {
  matches.sort((a, b) => {
    const aPath = a.left?.path ?? a.right?.path ?? []
    const bPath = b.left?.path ?? b.right?.path ?? []

    // Compare paths element by element
    const minLen = Math.min(aPath.length, bPath.length)
    for (let i = 0; i < minLen; i++) {
      if (aPath[i] !== bPath[i]) {
        return aPath[i] - bPath[i]
      }
    }

    // Shorter path comes first
    if (aPath.length !== bPath.length) {
      return aPath.length - bPath.length
    }

    // If paths are identical, prefer left nodes
    if (a.left && !b.left) return -1
    if (!a.left && b.left) return 1

    return 0
  })
}

/**
 * Builds the hierarchical structure for recursive rendering.
 */
function buildHierarchy(matches: MatchedPair[]): {
  rootMatches: MatchedPair[]
  childMatchesByParentKey: Map<string, MatchedPair[]>
} {
  const childMatchesByParentKey = new Map<string, MatchedPair[]>()
  const rootMatches: MatchedPair[] = []

  for (const match of matches) {
    const node = match.left?.node ?? match.right?.node
    if (!node) continue

    const parentKey = node.parentMatchKey

    if (!parentKey) {
      // Root node
      rootMatches.push(match)
    } else {
      // Child node
      if (!childMatchesByParentKey.has(parentKey)) {
        childMatchesByParentKey.set(parentKey, [])
      }
      childMatchesByParentKey.get(parentKey)!.push(match)
    }
  }

  return { rootMatches, childMatchesByParentKey }
}

// =============================================================================
// Re-exports
// =============================================================================

export type {
  MatchResult,
  MatchedPair,
  DifferenceDetail,
  ParsedHtmlTree,
  FlatNode,
  HtmlTreeNode,
  ElementNode,
  TextNode,
} from './types'

export { isElementNode, isTextNode, getNodeDifferences } from './utils'

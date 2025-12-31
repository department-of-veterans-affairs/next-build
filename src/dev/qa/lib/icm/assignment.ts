/**
 * ICM Assignment Algorithm
 *
 * Performs greedy assignment of left nodes to right nodes
 * based on current total scores. Also manages state initialization.
 */

import type { FlatNode, MatchingState, CandidateMatch } from './types'
import { MINIMUM_MATCH_THRESHOLD, ANCHOR_THRESHOLD } from './types'

// =============================================================================
// State Initialization
// =============================================================================

/**
 * Creates a new matching state for the algorithm.
 */
export function initializeState(
  leftNodes: FlatNode[],
  rightNodes: FlatNode[]
): MatchingState {
  return {
    leftNodes,
    rightNodes,
    candidates: new Map(),
    assignments: new Map(),
    reverseAssignments: new Map(),
    anchors: new Set(),
    iteration: 0,
  }
}

// =============================================================================
// Greedy Assignment
// =============================================================================

/**
 * Performs greedy assignment based on current total scores.
 *
 * Algorithm:
 * 1. Collect all candidate pairs with their scores
 * 2. Sort by score descending
 * 3. Greedily assign top-scoring pairs (each node can only be assigned once)
 * 4. Mark high-confidence assignments as anchors
 *
 * This replaces previous assignments completely.
 */
export function greedyAssignment(state: MatchingState): void {
  // Clear existing assignments
  state.assignments.clear()
  state.reverseAssignments.clear()
  state.anchors.clear()

  // Collect all candidate pairs with scores
  const allPairs: Array<{
    leftIndex: number
    rightIndex: number
    score: number
  }> = []

  for (const [leftIndex, candidates] of state.candidates) {
    for (const candidate of candidates) {
      allPairs.push({
        leftIndex,
        rightIndex: candidate.rightIndex,
        score: candidate.totalScore,
      })
    }
  }

  // Sort by score descending (highest first)
  allPairs.sort((a, b) => b.score - a.score)

  // Track which nodes have been assigned
  const usedLeft = new Set<number>()
  const usedRight = new Set<number>()

  // Greedily assign
  for (const pair of allPairs) {
    // Skip if either node already assigned
    if (usedLeft.has(pair.leftIndex) || usedRight.has(pair.rightIndex)) {
      continue
    }

    // Skip if score below minimum threshold
    if (pair.score < MINIMUM_MATCH_THRESHOLD) {
      continue
    }

    // Make the assignment
    state.assignments.set(pair.leftIndex, pair.rightIndex)
    state.reverseAssignments.set(pair.rightIndex, pair.leftIndex)
    usedLeft.add(pair.leftIndex)
    usedRight.add(pair.rightIndex)

    // Mark as anchor if high confidence
    if (pair.score >= ANCHOR_THRESHOLD) {
      state.anchors.add(pair.leftIndex)
    }
  }
}

/**
 * Gets the current best candidate for a left node.
 * Returns undefined if no candidates exist.
 */
export function getBestCandidate(
  state: MatchingState,
  leftIndex: number
): CandidateMatch | undefined {
  const candidates = state.candidates.get(leftIndex)
  if (!candidates || candidates.length === 0) return undefined

  // Candidates are sorted by totalScore descending
  return candidates[0]
}

/**
 * Checks if a left node is currently assigned.
 */
export function isAssigned(state: MatchingState, leftIndex: number): boolean {
  return state.assignments.has(leftIndex)
}

/**
 * Gets the assigned right index for a left index.
 */
export function getAssignment(
  state: MatchingState,
  leftIndex: number
): number | undefined {
  return state.assignments.get(leftIndex)
}

/**
 * Gets the assigned left index for a right index.
 */
export function getReverseAssignment(
  state: MatchingState,
  rightIndex: number
): number | undefined {
  return state.reverseAssignments.get(rightIndex)
}

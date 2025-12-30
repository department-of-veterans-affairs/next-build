/**
 * ICM Context Propagation
 *
 * Propagates context scores based on current assignments.
 * If parents, siblings, or children are matched, boost scores
 * for candidate pairs that preserve those relationships.
 */

import type { MatchingState, ScoringWeights } from './types'
import { DEFAULT_WEIGHTS } from './types'
import {
  getParentIndex,
  getPreviousSiblingIndex,
  getNextSiblingIndex,
  computeChildMatchRatio,
} from './utils'
import { updateCandidateContextScore } from './similarity'

// =============================================================================
// Context Propagation
// =============================================================================

/**
 * Propagates context scores based on current assignments.
 *
 * For each candidate pair (L, R), adds bonus if:
 * - L's parent is assigned to R's parent
 * - L's previous sibling is assigned to R's previous sibling
 * - L's next sibling is assigned to R's next sibling
 * - L's children are matched to R's children
 *
 * Returns true if any scores changed significantly (> 0.5 points).
 */
export function propagateContext(
  state: MatchingState,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): boolean {
  let changed = false
  const CHANGE_THRESHOLD = 0.5

  for (const [leftIndex, candidates] of state.candidates) {
    const leftNode = state.leftNodes[leftIndex]

    // Pre-compute left node's relatives
    const leftParentIdx = getParentIndex(leftNode, state.leftNodes)
    const leftPrevSibIdx = getPreviousSiblingIndex(leftNode, state.leftNodes)
    const leftNextSibIdx = getNextSiblingIndex(leftNode, state.leftNodes)

    for (const candidate of candidates) {
      const rightNode = state.rightNodes[candidate.rightIndex]

      // Pre-compute right node's relatives
      const rightParentIdx = getParentIndex(rightNode, state.rightNodes)
      const rightPrevSibIdx = getPreviousSiblingIndex(
        rightNode,
        state.rightNodes
      )
      const rightNextSibIdx = getNextSiblingIndex(rightNode, state.rightNodes)

      let contextBonus = 0

      // Parent context: if L's parent is assigned to R's parent
      if (leftParentIdx !== null && rightParentIdx !== null) {
        const assignedRightParent = state.assignments.get(leftParentIdx)
        if (assignedRightParent === rightParentIdx) {
          contextBonus += weights.parentContext
        }
      }

      // Previous sibling context
      if (leftPrevSibIdx !== null && rightPrevSibIdx !== null) {
        const assignedRightPrevSib = state.assignments.get(leftPrevSibIdx)
        if (assignedRightPrevSib === rightPrevSibIdx) {
          contextBonus += weights.siblingContext
        }
      }

      // Next sibling context
      if (leftNextSibIdx !== null && rightNextSibIdx !== null) {
        const assignedRightNextSib = state.assignments.get(leftNextSibIdx)
        if (assignedRightNextSib === rightNextSibIdx) {
          contextBonus += weights.siblingContext
        }
      }

      // Child context: ratio of children matched correctly
      const childMatchRatio = computeChildMatchRatio(leftNode, rightNode, state)
      contextBonus += childMatchRatio * weights.childContext

      // Check if score changed significantly
      const oldContextScore = candidate.contextScore
      if (Math.abs(contextBonus - oldContextScore) > CHANGE_THRESHOLD) {
        changed = true
      }

      // Update the candidate's context score
      updateCandidateContextScore(
        state,
        leftIndex,
        candidate.rightIndex,
        contextBonus
      )
    }
  }

  return changed
}

/**
 * Propagates context in both directions (left-to-right and right-to-left).
 * This is a more thorough version that ensures bidirectional consistency.
 *
 * The basic propagateContext only considers left->right relationships.
 * This version also considers right->left to catch cases where the
 * right tree has different structure.
 *
 * Returns true if any scores changed.
 */
export function propagateContextBidirectional(
  state: MatchingState,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): boolean {
  // First pass: left-to-right
  const changedLR = propagateContext(state, weights)

  // Second pass: for each right node, check if its relatives being
  // assigned affects any candidate pairs
  let changedRL = false
  const CHANGE_THRESHOLD = 0.5

  for (const rightNode of state.rightNodes) {
    const rightIndex = rightNode.index

    // Check if this right node is assigned
    const assignedLeftIdx = state.reverseAssignments.get(rightIndex)
    if (assignedLeftIdx === undefined) continue

    // Get right node's relatives
    const rightParentIdx = getParentIndex(rightNode, state.rightNodes)
    // For each relative, if they're assigned, boost the corresponding left candidates
    if (rightParentIdx !== null) {
      const assignedLeftParent = state.reverseAssignments.get(rightParentIdx)
      if (assignedLeftParent !== undefined) {
        // Find candidates where left parent matches
        const parentCandidates = state.candidates.get(assignedLeftParent)
        if (parentCandidates) {
          for (const cand of parentCandidates) {
            if (cand.rightIndex === rightParentIdx) {
              const oldScore = cand.contextScore
              const bonus = cand.contextScore + weights.parentContext * 0.5 // Smaller boost for reverse
              if (Math.abs(bonus - oldScore) > CHANGE_THRESHOLD) {
                updateCandidateContextScore(
                  state,
                  assignedLeftParent,
                  rightParentIdx,
                  bonus
                )
                changedRL = true
              }
            }
          }
        }
      }
    }

    // Similar for siblings (less important, skip for now to reduce complexity)
  }

  return changedLR || changedRL
}

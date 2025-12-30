/**
 * ICM Anchor Recovery
 *
 * The "multi-multi-pass" recovery mechanism.
 *
 * After initial matching, identifies high-confidence "anchor" matches
 * and uses them to define regions. Within each region, re-scores
 * candidates using structural constraints relative to the anchors.
 *
 * This allows recovery when two similar elements are initially not matched
 * due to class differences, but later matching reveals they should match.
 */

import type { FlatNode, MatchingState, ScoringWeights } from './types'
import { DEFAULT_WEIGHTS } from './types'
import { updateCandidateStructuralScore } from './similarity'
import { greedyAssignment } from './assignment'

// =============================================================================
// Region Identification
// =============================================================================

/**
 * Gets all node indices in a region between two anchor indices.
 * Region includes nodes where: startAnchor < index < endAnchor
 * and the node is not itself an anchor.
 */
function getNodesInRegion(
  nodes: FlatNode[],
  anchors: Set<number>,
  startAnchor: number,
  endAnchor: number
): number[] {
  const regionIndices: number[] = []

  for (const node of nodes) {
    const idx = node.index

    // Must be between anchors (exclusive)
    if (idx <= startAnchor || idx >= endAnchor) continue

    // Must not be an anchor itself
    if (anchors.has(idx)) continue

    regionIndices.push(idx)
  }

  return regionIndices
}

/**
 * Gets the corresponding right-side region for a left-side region.
 *
 * Uses the anchor assignments to determine boundaries:
 * - If startAnchor is assigned, use that assignment as right start
 * - If endAnchor is assigned, use that assignment as right end
 * - For virtual boundaries (-1 or length), use 0 or rightNodes.length
 */
function getCorrespondingRightRegion(
  state: MatchingState,
  startAnchor: number,
  endAnchor: number
): number[] {
  // Determine right-side boundaries
  let rightStart = -1
  let rightEnd = state.rightNodes.length

  if (startAnchor >= 0) {
    const assignedRight = state.assignments.get(startAnchor)
    if (assignedRight !== undefined) {
      rightStart = assignedRight
    }
  }

  if (endAnchor < state.leftNodes.length) {
    const assignedRight = state.assignments.get(endAnchor)
    if (assignedRight !== undefined) {
      rightEnd = assignedRight
    }
  }

  // Collect right indices in this range that aren't assigned to anchors
  const rightRegion: number[] = []
  const assignedToAnchors = new Set<number>()

  for (const anchorIdx of state.anchors) {
    const assignedRight = state.assignments.get(anchorIdx)
    if (assignedRight !== undefined) {
      assignedToAnchors.add(assignedRight)
    }
  }

  for (const rightNode of state.rightNodes) {
    const idx = rightNode.index

    if (idx <= rightStart || idx >= rightEnd) continue
    if (assignedToAnchors.has(idx)) continue

    rightRegion.push(idx)
  }

  return rightRegion
}

// =============================================================================
// Region Re-scoring
// =============================================================================

/**
 * Re-scores candidates within a region using structural constraints.
 *
 * For candidates (L, R) where L is in leftRegion and R is in rightRegion:
 * - Boost if relative position within region is similar
 * - Boost if depth relative to anchor is the same
 *
 * Returns true if any scores changed significantly.
 */
function rescoreRegion(
  state: MatchingState,
  leftRegion: number[],
  rightRegion: number[],
  startAnchor: number,
  weights: ScoringWeights
): boolean {
  let changed = false
  const CHANGE_THRESHOLD = 0.5

  // Pre-compute region set for fast lookup
  const rightRegionSet = new Set(rightRegion)

  // Get anchor depths for relative depth calculation
  const startAnchorDepth =
    startAnchor >= 0 ? state.leftNodes[startAnchor].node.depth : 0
  const rightStartAnchor =
    startAnchor >= 0 ? state.assignments.get(startAnchor) : undefined
  const rightStartAnchorDepth =
    rightStartAnchor !== undefined
      ? state.rightNodes[rightStartAnchor].node.depth
      : 0

  for (const leftIdx of leftRegion) {
    const leftNode = state.leftNodes[leftIdx]
    const candidates = state.candidates.get(leftIdx)
    if (!candidates) continue

    // Calculate left node's relative position in region (0 to 1)
    const leftPosInRegion = leftRegion.indexOf(leftIdx)
    const leftRelativePos =
      leftRegion.length > 1 ? leftPosInRegion / (leftRegion.length - 1) : 0.5

    // Calculate left node's depth relative to anchor
    const leftRelativeDepth = leftNode.node.depth - startAnchorDepth

    for (const candidate of candidates) {
      // Only consider candidates in the right region
      if (!rightRegionSet.has(candidate.rightIndex)) continue

      const rightNode = state.rightNodes[candidate.rightIndex]

      let structuralBonus = 0

      // Position similarity within region
      const rightPosInRegion = rightRegion.indexOf(candidate.rightIndex)
      const rightRelativePos =
        rightRegion.length > 1
          ? rightPosInRegion / (rightRegion.length - 1)
          : 0.5

      const positionSimilarity =
        1 - Math.abs(leftRelativePos - rightRelativePos)
      structuralBonus += positionSimilarity * weights.structuralPosition

      // Relative depth match
      const rightRelativeDepth = rightNode.node.depth - rightStartAnchorDepth
      if (leftRelativeDepth === rightRelativeDepth) {
        structuralBonus += weights.relativeDepth
      }

      // Check for significant change
      const oldStructuralScore = candidate.structuralScore
      if (Math.abs(structuralBonus - oldStructuralScore) > CHANGE_THRESHOLD) {
        changed = true
      }

      // Update structural score
      updateCandidateStructuralScore(
        state,
        leftIdx,
        candidate.rightIndex,
        structuralBonus
      )
    }
  }

  return changed
}

// =============================================================================
// Main Anchor Recovery
// =============================================================================

/**
 * Main anchor recovery function.
 *
 * 1. Sorts anchors by position
 * 2. Identifies regions between adjacent anchors
 * 3. Re-scores candidates within each region
 * 4. Re-runs assignment if scores changed
 *
 * Returns true if any improvements were made.
 */
export function anchorRecovery(
  state: MatchingState,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): boolean {
  // Need at least some structure to do recovery
  if (state.anchors.size === 0 && state.assignments.size === 0) {
    return false
  }

  let improved = false

  // Sort anchors by position in left tree
  const sortedAnchors = [...state.anchors].sort((a, b) => a - b)

  // Add virtual anchors at start and end
  const anchorBoundaries = [-1, ...sortedAnchors, state.leftNodes.length]

  // Process each region between adjacent anchors
  for (let i = 0; i < anchorBoundaries.length - 1; i++) {
    const startAnchor = anchorBoundaries[i]
    const endAnchor = anchorBoundaries[i + 1]

    // Get nodes in this region
    const leftRegion = getNodesInRegion(
      state.leftNodes,
      state.anchors,
      startAnchor,
      endAnchor
    )

    // Skip empty regions
    if (leftRegion.length === 0) continue

    // Get corresponding right region
    const rightRegion = getCorrespondingRightRegion(
      state,
      startAnchor,
      endAnchor
    )

    // Skip if right region is empty
    if (rightRegion.length === 0) continue

    // Re-score with structural constraints
    const regionChanged = rescoreRegion(
      state,
      leftRegion,
      rightRegion,
      startAnchor,
      weights
    )

    if (regionChanged) {
      improved = true
    }
  }

  // If any scores changed, re-run assignment
  if (improved) {
    greedyAssignment(state)
  }

  return improved
}

/**
 * Runs anchor recovery multiple times until no more improvements.
 * This is the "multi-multi-pass" - each recovery pass can create
 * new anchors which enable further recovery.
 *
 * Returns the number of recovery passes that made improvements.
 */
export function runRecoveryUntilStable(
  state: MatchingState,
  weights: ScoringWeights = DEFAULT_WEIGHTS,
  maxPasses: number = 10
): number {
  let passCount = 0

  for (let i = 0; i < maxPasses; i++) {
    const prevAnchorCount = state.anchors.size
    const improved = anchorRecovery(state, weights)

    if (!improved && state.anchors.size === prevAnchorCount) {
      break
    }

    passCount++
  }

  return passCount
}

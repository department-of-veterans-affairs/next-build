/**
 * ICM Similarity Scoring
 *
 * Computes base similarity scores between node pairs.
 * These scores represent intrinsic similarity based on node properties,
 * before any context propagation or structural adjustments.
 */

import type {
  FlatNode,
  MatchingState,
  CandidateMatch,
  ScoringWeights,
} from './types'
import { DEFAULT_WEIGHTS } from './types'
import {
  isElementNode,
  isTextNode,
  levenshteinSimilarity,
  computeAttributeOverlap,
  computeClassOverlap,
} from './utils'

// =============================================================================
// Base Similarity Computation
// =============================================================================

/**
 * Computes the base similarity score between two nodes.
 * Only considers intrinsic properties (tag, text, attributes, etc.)
 * Does NOT consider structural context (parent/sibling relationships).
 *
 * Returns a raw score (not normalized). Higher is better.
 * Returns 0 if nodes cannot be matched (e.g., different types/tags).
 */
export function computeBaseSimilarity(
  left: FlatNode,
  right: FlatNode,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  const leftNode = left.node
  const rightNode = right.node

  // GATE: Type must match
  if (leftNode.type !== rightNode.type) {
    return 0
  }

  // GATE: For elements, tag must match
  if (isElementNode(leftNode) && isElementNode(rightNode)) {
    if (leftNode.tagName !== rightNode.tagName) {
      return 0
    }
  }

  let score = 0

  // Tag match baseline (already passed gate, so this is guaranteed)
  score += weights.tagMatch

  // For element nodes
  if (isElementNode(leftNode) && isElementNode(rightNode)) {
    // ID match (very strong signal)
    if (leftNode.id && leftNode.id === rightNode.id) {
      score += weights.idMatch
    }

    // Attribute overlap (excluding class)
    const attrOverlap = computeAttributeOverlap(
      leftNode.attributes,
      rightNode.attributes,
      ['class']
    )
    score += attrOverlap * weights.attrOverlap

    // Class overlap (low weight - key change from old algorithm!)
    const classOverlap = computeClassOverlap(
      leftNode.attributes.class,
      rightNode.attributes.class
    )
    score += classOverlap * weights.classOverlap
  }

  // For text nodes
  if (isTextNode(leftNode) && isTextNode(rightNode)) {
    const textSimilarity = levenshteinSimilarity(
      leftNode.textContent,
      rightNode.textContent
    )
    score += textSimilarity * weights.textSimilarity
  }

  // Depth match bonus
  if (leftNode.depth === rightNode.depth) {
    score += weights.depthMatch
  }

  return score
}

// =============================================================================
// Candidate Graph Building
// =============================================================================

/**
 * Builds the initial candidate graph by computing base similarity
 * between all left-right node pairs.
 *
 * For each left node, stores all right nodes with their similarity scores.
 * No filtering is done at this stage - all candidates are kept.
 */
export function buildCandidateGraph(
  state: MatchingState,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): void {
  const { leftNodes, rightNodes, candidates } = state

  // Clear existing candidates
  candidates.clear()

  // For each left node, find all potential right matches
  for (const leftNode of leftNodes) {
    const nodeCandidates: CandidateMatch[] = []

    for (const rightNode of rightNodes) {
      const baseScore = computeBaseSimilarity(leftNode, rightNode, weights)

      // Keep all candidates with any positive score
      if (baseScore > 0) {
        nodeCandidates.push({
          leftIndex: leftNode.index,
          rightIndex: rightNode.index,
          baseScore,
          contextScore: 0,
          structuralScore: 0,
          totalScore: baseScore,
        })
      }
    }

    // Sort candidates by score descending for efficient greedy selection later
    nodeCandidates.sort((a, b) => b.totalScore - a.totalScore)

    candidates.set(leftNode.index, nodeCandidates)
  }
}

/**
 * Gets a candidate match between two specific nodes.
 * Returns undefined if no candidate exists.
 */
export function getCandidate(
  state: MatchingState,
  leftIndex: number,
  rightIndex: number
): CandidateMatch | undefined {
  const nodeCandidates = state.candidates.get(leftIndex)
  if (!nodeCandidates) return undefined

  return nodeCandidates.find((c) => c.rightIndex === rightIndex)
}

/**
 * Updates a candidate's context score and recalculates total.
 * Also re-sorts the candidate list for the left node.
 */
export function updateCandidateContextScore(
  state: MatchingState,
  leftIndex: number,
  rightIndex: number,
  contextScore: number
): void {
  const nodeCandidates = state.candidates.get(leftIndex)
  if (!nodeCandidates) return

  const candidate = nodeCandidates.find((c) => c.rightIndex === rightIndex)
  if (!candidate) return

  candidate.contextScore = contextScore
  candidate.totalScore =
    candidate.baseScore + candidate.contextScore + candidate.structuralScore

  // Re-sort after score update
  nodeCandidates.sort((a, b) => b.totalScore - a.totalScore)
}

/**
 * Updates a candidate's structural score and recalculates total.
 * Also re-sorts the candidate list for the left node.
 */
export function updateCandidateStructuralScore(
  state: MatchingState,
  leftIndex: number,
  rightIndex: number,
  structuralScore: number
): void {
  const nodeCandidates = state.candidates.get(leftIndex)
  if (!nodeCandidates) return

  const candidate = nodeCandidates.find((c) => c.rightIndex === rightIndex)
  if (!candidate) return

  candidate.structuralScore = structuralScore
  candidate.totalScore =
    candidate.baseScore + candidate.contextScore + candidate.structuralScore

  // Re-sort after score update
  nodeCandidates.sort((a, b) => b.totalScore - a.totalScore)
}

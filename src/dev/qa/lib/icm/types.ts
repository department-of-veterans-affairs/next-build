/**
 * ICM (Iterative Consensus Matching) Type Definitions
 *
 * Types for the matching algorithm that uses iterative context propagation
 * and anchor-based recovery to robustly match HTML elements.
 */

// =============================================================================
// Re-exports from htmlTreeParser
// =============================================================================

export type {
  HtmlTreeNode,
  ElementNode,
  TextNode,
  FlatNode,
  ParsedHtmlTree,
} from '../htmlTreeParser'

export { pathToString, pathsEqual, isAncestorPath } from '../htmlTreeParser'

// =============================================================================
// Output Types (maintain compatibility with existing UI)
// =============================================================================

export interface DifferenceDetail {
  type: 'attribute' | 'tag' | 'text' | 'children' | 'missing'
  description: string
  leftValue?: string
  rightValue?: string
}

export interface MatchedPair {
  left: import('../htmlTreeParser').FlatNode | null
  right: import('../htmlTreeParser').FlatNode | null
  /** Confidence score 0-1, where 1 is perfect match */
  matchConfidence: number
  /** Whether the nodes have any differences */
  isDifferent: boolean
  /** True if this node is a child of a parent that's already missing */
  isChildOfMissing: boolean
  /** Pre-computed differences (empty if not different) */
  differences: DifferenceDetail[]
}

export interface MatchResult {
  /** All matched pairs in depth-first order */
  matches: MatchedPair[]
  /** Only top-level (root) matches for starting recursive rendering */
  rootMatches: MatchedPair[]
  /** Map from parent matchKey to its child matches */
  childMatchesByParentKey: Map<string, MatchedPair[]>
}

// =============================================================================
// Internal Types for ICM Algorithm
// =============================================================================

/**
 * A candidate match between a left node and a right node.
 * Tracks multiple score components that are combined for total score.
 */
export interface CandidateMatch {
  leftIndex: number
  rightIndex: number
  /** Score from intrinsic properties (tag, text, attributes) */
  baseScore: number
  /** Score from parent/sibling/child context */
  contextScore: number
  /** Score from structural position (anchor-relative) */
  structuralScore: number
  /** Combined score: baseScore + contextScore + structuralScore */
  totalScore: number
}

/**
 * The complete state of the matching algorithm.
 * Mutated across iterations as matching improves.
 */
export interface MatchingState {
  /** All left-side nodes */
  leftNodes: import('../htmlTreeParser').FlatNode[]
  /** All right-side nodes */
  rightNodes: import('../htmlTreeParser').FlatNode[]
  /** Map from left node index to its candidate matches */
  candidates: Map<number, CandidateMatch[]>
  /** Current assignments: leftIndex -> rightIndex */
  assignments: Map<number, number>
  /** Reverse lookup: rightIndex -> leftIndex */
  reverseAssignments: Map<number, number>
  /** Set of left indices that are high-confidence anchors */
  anchors: Set<number>
  /** Current iteration number */
  iteration: number
}

// =============================================================================
// Scoring Configuration
// =============================================================================

/**
 * Weights for different scoring components.
 * Can be tuned to adjust matching behavior.
 */
export interface ScoringWeights {
  // Base similarity weights (intrinsic properties)
  tagMatch: number
  idMatch: number
  textSimilarity: number
  attrOverlap: number
  classOverlap: number
  depthMatch: number

  // Context propagation weights
  parentContext: number
  siblingContext: number
  childContext: number

  // Structural recovery weights
  structuralPosition: number
  relativeDepth: number
}

/**
 * Default scoring weights.
 * Classes are intentionally low-weighted since they often differ
 * between environments while the content is semantically the same.
 */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  // Base similarity (max ~130 raw points)
  tagMatch: 20,
  idMatch: 50,
  textSimilarity: 30,
  attrOverlap: 20,
  classOverlap: 5, // Intentionally low!
  depthMatch: 5,

  // Context propagation (applied after base)
  parentContext: 25,
  siblingContext: 15,
  childContext: 20,

  // Structural recovery (applied during anchor recovery)
  structuralPosition: 15,
  relativeDepth: 10,
}

// =============================================================================
// Algorithm Constants
// =============================================================================

/**
 * Minimum score required to consider a match.
 * Below this, nodes are considered unmatched.
 */
export const MINIMUM_MATCH_THRESHOLD = 25

/**
 * Score threshold for marking a match as an "anchor".
 * Anchors are used as reference points for structural recovery.
 */
export const ANCHOR_THRESHOLD = 80

/**
 * Maximum number of iterations before forcing convergence.
 */
export const MAX_ITERATIONS = 100

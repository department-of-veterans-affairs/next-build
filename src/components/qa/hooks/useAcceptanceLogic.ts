/**
 * useAcceptanceLogic - Handles accept/unaccept operations and calculations
 */

import * as React from 'react'
import { MatchResult, MatchedPair } from '@/lib/qa/icm'

interface UseAcceptanceLogicOptions {
  matchResult: MatchResult | null
  acceptedDifferencesSet: Set<string>
  onAcceptMultiple?: (keys: string[]) => void
  onUnacceptMultiple?: (keys: string[]) => void
}

// Helper to get nodeId from a match
function getNodeId(match: MatchedPair): string {
  const leftNode = match.left?.node
  const rightNode = match.right?.node
  const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
  return matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`
}

// Helper to filter to navigable matches (has differences, not child of missing)
function getNavigableMatches(matches: MatchedPair[]): MatchedPair[] {
  return matches.filter((match) => match.isDifferent && !match.isChildOfMissing)
}

export const useAcceptanceLogic = ({
  matchResult,
  acceptedDifferencesSet,
  onAcceptMultiple,
  onUnacceptMultiple,
}: UseAcceptanceLogicOptions) => {
  // Accept all differences
  const handleAcceptAll = React.useCallback(() => {
    if (!matchResult || !onAcceptMultiple) return

    const keysToAccept: string[] = []
    const navigable = getNavigableMatches(matchResult.matches)

    navigable.forEach((match) => {
      const nodeId = getNodeId(match)
      match.differences.forEach((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        if (!acceptedDifferencesSet.has(key)) {
          keysToAccept.push(key)
        }
      })
    })

    onAcceptMultiple(keysToAccept)
  }, [matchResult, acceptedDifferencesSet, onAcceptMultiple])

  // Unaccept all differences
  const handleUnacceptAll = React.useCallback(() => {
    if (!matchResult || !onUnacceptMultiple) return

    const keysToUnaccept: string[] = []
    const navigable = getNavigableMatches(matchResult.matches)

    navigable.forEach((match) => {
      const nodeId = getNodeId(match)
      match.differences.forEach((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        if (acceptedDifferencesSet.has(key)) {
          keysToUnaccept.push(key)
        }
      })
    })

    onUnacceptMultiple(keysToUnaccept)
  }, [matchResult, acceptedDifferencesSet, onUnacceptMultiple])

  // Check if there are any unaccepted differences
  const hasUnacceptedDifferences = React.useMemo(() => {
    if (!matchResult) return false

    const navigable = getNavigableMatches(matchResult.matches)

    return navigable.some((match) => {
      const nodeId = getNodeId(match)
      return match.differences.some((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        return !acceptedDifferencesSet.has(key)
      })
    })
  }, [matchResult, acceptedDifferencesSet])

  // Check if there are any accepted differences
  const hasAcceptedDifferences = React.useMemo(() => {
    if (!matchResult) return false

    const navigable = getNavigableMatches(matchResult.matches)

    return navigable.some((match) => {
      const nodeId = getNodeId(match)
      return match.differences.some((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        return acceptedDifferencesSet.has(key)
      })
    })
  }, [matchResult, acceptedDifferencesSet])

  // Count elements where ALL differences are accepted
  const acceptedCount = React.useMemo(() => {
    if (!matchResult) return 0

    const navigable = getNavigableMatches(matchResult.matches)

    let count = 0
    navigable.forEach((match) => {
      const nodeId = getNodeId(match)
      const allAccepted = match.differences.every((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        return acceptedDifferencesSet.has(key)
      })

      if (allAccepted) {
        count++
      }
    })

    return count
  }, [matchResult, acceptedDifferencesSet])

  return {
    handleAcceptAll,
    handleUnacceptAll,
    hasUnacceptedDifferences,
    hasAcceptedDifferences,
    acceptedCount,
  }
}

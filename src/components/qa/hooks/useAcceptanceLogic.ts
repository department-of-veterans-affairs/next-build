/**
 * useAcceptanceLogic - Handles accept/unaccept operations and calculations
 */

import * as React from 'react'
import { MatchResult } from '@/lib/qa/elementMatcher'
import { getNavigableDifferences } from '../TreeNodeRenderer'

interface UseAcceptanceLogicOptions {
  matchResult: MatchResult | null
  acceptedDifferencesSet: Set<string>
  onAcceptMultiple?: (keys: string[]) => void
  onUnacceptMultiple?: (keys: string[]) => void
}

export const useAcceptanceLogic = ({
  matchResult,
  acceptedDifferencesSet,
  onAcceptMultiple,
  onUnacceptMultiple,
}: UseAcceptanceLogicOptions) => {
  // Accept all navigable differences
  const handleAcceptAll = React.useCallback(() => {
    if (!matchResult || !onAcceptMultiple) return

    const keysToAccept: string[] = []
    const navDiffs = getNavigableDifferences(
      matchResult.matches,
      acceptedDifferencesSet,
      true
    )

    navDiffs.forEach(({ match }) => {
      const leftNode = match.left?.node
      const rightNode = match.right?.node
      const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
      const nodeId =
        matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`

      match.differences.forEach((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        if (!acceptedDifferencesSet.has(key)) {
          keysToAccept.push(key)
        }
      })
    })

    onAcceptMultiple(keysToAccept)
  }, [matchResult, acceptedDifferencesSet, onAcceptMultiple])

  // Unaccept all navigable differences
  const handleUnacceptAll = React.useCallback(() => {
    if (!matchResult || !onUnacceptMultiple) return

    const keysToUnaccept: string[] = []
    const navDiffs = getNavigableDifferences(
      matchResult.matches,
      acceptedDifferencesSet,
      true
    )

    navDiffs.forEach(({ match }) => {
      const leftNode = match.left?.node
      const rightNode = match.right?.node
      const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
      const nodeId =
        matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`

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

    const navDiffs = getNavigableDifferences(
      matchResult.matches,
      acceptedDifferencesSet,
      true
    )

    return navDiffs.some(({ match }) => {
      const leftNode = match.left?.node
      const rightNode = match.right?.node
      const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
      const nodeId =
        matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`

      return match.differences.some((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        return !acceptedDifferencesSet.has(key)
      })
    })
  }, [matchResult, acceptedDifferencesSet])

  // Check if there are any accepted differences
  const hasAcceptedDifferences = React.useMemo(() => {
    if (!matchResult) return false

    const navDiffs = getNavigableDifferences(
      matchResult.matches,
      acceptedDifferencesSet,
      true
    )

    return navDiffs.some(({ match }) => {
      const leftNode = match.left?.node
      const rightNode = match.right?.node
      const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
      const nodeId =
        matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`

      return match.differences.some((_, diffIndex) => {
        const key = `${nodeId}:${diffIndex}`
        return acceptedDifferencesSet.has(key)
      })
    })
  }, [matchResult, acceptedDifferencesSet])

  // Count elements where ALL differences are accepted
  const acceptedCount = React.useMemo(() => {
    if (!matchResult) return 0

    const navDiffs = getNavigableDifferences(
      matchResult.matches,
      acceptedDifferencesSet,
      true
    )

    let count = 0
    navDiffs.forEach(({ match }) => {
      const leftNode = match.left?.node
      const rightNode = match.right?.node
      const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
      const nodeId =
        matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`

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

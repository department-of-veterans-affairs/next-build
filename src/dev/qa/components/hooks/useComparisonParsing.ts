/**
 * useComparisonParsing - Handles HTML parsing and tree matching
 *
 * Uses a two-phase approach to ensure the loading UI is painted before
 * starting the heavy matching computation:
 * 1. First effect sets loading state
 * 2. Second effect (triggered by loading state) does the actual work
 *    after waiting for the browser to paint
 */

import * as React from 'react'
import { parseHtmlToTree } from '@/dev/qa/lib/htmlTreeParser'
import { matchElements, MatchResult } from '@/dev/qa/lib/icm'

interface UseComparisonParsingOptions {
  html1: string
  html2: string
  env1Label: string
  env2Label: string
  collapseWhitespace: boolean
  includeDataTestId: boolean
}

/**
 * Waits for the browser to paint before resolving.
 * Uses double requestAnimationFrame to ensure paint has happened.
 */
function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
}

export const useComparisonParsing = ({
  html1,
  html2,
  env1Label,
  env2Label,
  collapseWhitespace,
  includeDataTestId,
}: UseComparisonParsingOptions) => {
  const [matchResult, setMatchResult] = React.useState<MatchResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Track a "generation" to know when inputs change
  const [generation, setGeneration] = React.useState(0)

  // Effect 1: When inputs change, trigger loading state
  React.useEffect(() => {
    setMatchResult(null)
    setError(null)
    setIsLoading(true)
    setGeneration((g) => g + 1)
  }, [
    html1,
    html2,
    collapseWhitespace,
    includeDataTestId,
    env1Label,
    env2Label,
  ])

  // Effect 2: When loading starts, wait for paint then do heavy work
  React.useEffect(() => {
    if (!isLoading) return

    let cancelled = false

    const doWork = async () => {
      // Wait for the loading UI to be painted
      await waitForPaint()

      if (cancelled) return

      try {
        // Parse HTML strings in the browser
        const parser = new DOMParser()

        const doc1 = parser.parseFromString(html1, 'text/html')
        const doc2 = parser.parseFromString(html2, 'text/html')

        const rootElement1 = doc1.body.firstElementChild
        const rootElement2 = doc2.body.firstElementChild

        if (!rootElement1 || !rootElement2) {
          if (!cancelled) {
            setError('Failed to parse HTML')
            setIsLoading(false)
          }
          return
        }

        const parsedTree1 = parseHtmlToTree(rootElement1, {
          collapseWhitespace,
          includeDataTestId,
        })
        const parsedTree2 = parseHtmlToTree(rootElement2, {
          collapseWhitespace,
          includeDataTestId,
        })

        // Match elements between trees (this is the heavy operation)
        const result = matchElements(
          parsedTree1,
          parsedTree2,
          env1Label,
          env2Label
        )

        if (!cancelled) {
          setMatchResult(result)
          setError(null)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error parsing HTML:', err)
          setError(err instanceof Error ? err.message : 'Unknown error')
          setIsLoading(false)
        }
      }
    }

    doWork()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]) // Only re-run when generation changes (inputs changed)

  return { matchResult, error, isLoading }
}

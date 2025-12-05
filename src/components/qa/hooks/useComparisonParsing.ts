/**
 * useComparisonParsing - Handles HTML parsing and tree matching
 */

import * as React from 'react'
import { parseHtmlToTree } from '@/lib/qa/htmlTreeParser'
import { matchElements, MatchResult } from '@/lib/qa/elementMatcher'

interface UseComparisonParsingOptions {
  html1: string
  html2: string
  env1Label: string
  env2Label: string
  collapseWhitespace: boolean
  includeDataTestId: boolean
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

  React.useEffect(() => {
    try {
      // Parse HTML strings in the browser
      const parser = new DOMParser()

      const doc1 = parser.parseFromString(html1, 'text/html')
      const doc2 = parser.parseFromString(html2, 'text/html')

      const rootElement1 = doc1.body.firstElementChild
      const rootElement2 = doc2.body.firstElementChild

      if (!rootElement1 || !rootElement2) {
        setError('Failed to parse HTML')
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

      // Match elements between trees
      const result = matchElements(
        parsedTree1,
        parsedTree2,
        env1Label,
        env2Label
      )
      setMatchResult(result)
      setError(null)
    } catch (err) {
      console.error('Error parsing HTML:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [
    html1,
    html2,
    collapseWhitespace,
    includeDataTestId,
    env1Label,
    env2Label,
  ])

  return { matchResult, error }
}

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { ComparisonContainer } from '@/dev/qa/components/ComparisonContainer'
import { ExportComparisons } from '@/dev/qa/components/ExportComparisons'
import { ImportComparisons } from '@/dev/qa/components/ImportComparisons'

interface ComparisonRecord {
  env1: string
  env2: string
  selector: string
  timestamp: string
  html1?: string
  html2?: string
  acceptedDifferences?: string[]
  comments?: Record<string, string>
  collapseWhitespace?: boolean
  includeDataTestId?: boolean
}

interface QAPath {
  path: string
  starred?: boolean
  notes?: string
  comparisons?: ComparisonRecord[]
}

interface QACache {
  resourceType: string
  paths: QAPath[]
  lastFetched?: string
}

type AllComparisonsData = {
  [contentType: string]: QACache
}

export default function ComparisonsPage() {
  const [allData, setAllData] = useState<AllComparisonsData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllComparisons = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/qa/all-comparisons')

      if (!response.ok) {
        throw new Error('Failed to fetch comparisons')
      }

      const data = await response.json()
      setAllData(data)
    } catch (err) {
      console.error('Error fetching comparisons:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch comparisons'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllComparisons()
  }, [fetchAllComparisons])

  const handleImportSuccess = useCallback(() => {
    // Refresh all comparisons after import
    fetchAllComparisons()
  }, [fetchAllComparisons])

  const handleDeleteComparison = useCallback(
    async (contentType: string, path: string, index: number) => {
      try {
        const response = await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            deleteComparisonIndex: index,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to delete comparison')
        }

        // Refresh data
        fetchAllComparisons()
      } catch (err) {
        console.error('Error deleting comparison:', err)
        alert('Failed to delete comparison. Please try again.')
      }
    },
    [fetchAllComparisons]
  )

  const handleUpdateComparison = useCallback(() => {
    // Optionally refresh after update, but not necessary since state is managed locally
    // fetchAllComparisons()
  }, [])

  // Calculate total comparisons
  const totalComparisons = Object.values(allData).reduce((total, cache) => {
    return (
      total +
      cache.paths.reduce(
        (pathTotal, path) => pathTotal + (path.comparisons?.length || 0),
        0
      )
    )
  }, 0)

  const hasComparisons = totalComparisons > 0

  return (
    <div className="vads-u-padding--3">
      <h1 className="vads-u-font-size--h2 vads-u-margin-top--0">
        QA Comparisons
      </h1>

      <div style={{ marginBottom: '24px' }}>
        <ExportComparisons hasComparisons={hasComparisons} />
        <ImportComparisons onImportSuccess={handleImportSuccess} />
      </div>

      {error && (
        <div className="usa-alert usa-alert--error vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && <p className="vads-u-color--gray">Loading comparisons...</p>}

      {!loading && !hasComparisons && (
        <p className="vads-u-color--gray">
          No comparisons found. Create comparisons on the review pages.
        </p>
      )}

      {!loading && hasComparisons && (
        <div>
          {Object.entries(allData).map(([contentType, cache]) => {
            // Filter paths that have comparisons
            const pathsWithComparisons = cache.paths.filter(
              (p) => p.comparisons && p.comparisons.length > 0
            )

            if (pathsWithComparisons.length === 0) {
              return null
            }

            const comparisonCount = pathsWithComparisons.reduce(
              (total, path) => total + (path.comparisons?.length || 0),
              0
            )

            return (
              <div
                key={contentType}
                style={{
                  marginBottom: '32px',
                  padding: '16px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  border: '1px solid #d6d7d9',
                }}
              >
                <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
                  {contentType} ({comparisonCount} comparison
                  {comparisonCount !== 1 ? 's' : ''})
                </h2>

                {pathsWithComparisons.map((qaPath) => (
                  <div
                    key={qaPath.path}
                    style={{
                      marginBottom: '12px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '16px',
                        marginBottom: '12px',
                        color: '#005ea2',
                      }}
                    >
                      {qaPath.path}
                    </h3>

                    {qaPath.comparisons?.map((comparison, index) => (
                      <ComparisonContainer
                        key={index}
                        comparison={comparison}
                        comparisonIndex={index}
                        path={qaPath.path}
                        contentType={contentType}
                        onDelete={() =>
                          handleDeleteComparison(
                            contentType,
                            qaPath.path,
                            index
                          )
                        }
                        onUpdate={handleUpdateComparison}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

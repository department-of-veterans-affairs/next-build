import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface QAPath {
  path: string
  starred?: boolean
  notes?: string
}

interface QACache {
  resourceType: string
  paths: QAPath[]
  lastFetched?: string
}

interface ReviewStatus {
  [path: string]: boolean
}

interface ReviewRowProps {
  qaPath: QAPath
  reviewed: boolean
  onReviewToggle: (path: string, reviewed: boolean) => void
}

const ReviewRow = React.memo<ReviewRowProps>(
  ({ qaPath, reviewed, onReviewToggle }) => {
    return (
      <div
        style={{
          display: 'table-row',
        }}
      >
        <div
          style={{
            display: 'table-cell',
            padding: '8px 12px',
            verticalAlign: 'top',
            width: '160px',
            borderTop: '1px solid #d6d7d9',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}
          >
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => onReviewToggle(qaPath.path, e.target.checked)}
              className="usa-checkbox"
              id={`review-${qaPath.path}`}
            />
            <label
              htmlFor={`review-${qaPath.path}`}
              style={{
                cursor: 'pointer',
                margin: 0,
              }}
            >
              Reviewed
            </label>
          </div>
        </div>
        <div
          style={{
            display: 'table-cell',
            padding: '8px 12px',
            verticalAlign: 'top',
            borderTop: '1px solid #d6d7d9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href={qaPath.path} target="_blank" rel="noopener noreferrer">
              {qaPath.path}
            </a>
            <span style={{ color: '#757575' }}>|</span>
            <a
              href={`https://www.va.gov${qaPath.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              (prod)
            </a>
          </div>
          {qaPath.notes && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              <strong>Notes:</strong>
              <p style={{ marginTop: '8px', marginBottom: 0 }}>
                {qaPath.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
)

ReviewRow.displayName = 'ReviewRow'

const getReviewStatusKey = (contentType: string): string => {
  return `qa-review-${contentType}`
}

const loadReviewStatus = (contentType: string): ReviewStatus => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(getReviewStatusKey(contentType))
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const saveReviewStatus = (contentType: string, status: ReviewStatus): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      getReviewStatusKey(contentType),
      JSON.stringify(status)
    )
  } catch (error) {
    console.error('Error saving review status:', error)
  }
}

export default function QAReviewPage() {
  const router = useRouter()
  const { 'content-type': contentType } = router.query

  const [cache, setCache] = useState<QACache | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>({})
  const [unstarredExpanded, setUnstarredExpanded] = useState<boolean>(false)
  const [exportedMarkdown, setExportedMarkdown] = useState<string | null>(null)

  useEffect(() => {
    if (typeof contentType === 'string') {
      setReviewStatus(loadReviewStatus(contentType))
    }
  }, [contentType])

  useEffect(() => {
    if (typeof contentType === 'string') {
      loadCache(contentType)
    }
  }, [contentType])

  const loadCache = async (resourceType: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/qa/paths?resourceType=${encodeURIComponent(resourceType)}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load paths')
      }

      const data = await response.json()
      setCache(data)
    } catch (err) {
      console.error('Error loading cache:', err)
      setError(err.message || 'An error occurred while loading paths')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewToggle = React.useCallback(
    (path: string, reviewed: boolean) => {
      if (typeof contentType !== 'string') return

      setReviewStatus((prev) => {
        const newStatus = {
          ...prev,
          [path]: reviewed,
        }
        saveReviewStatus(contentType, newStatus)
        return newStatus
      })
    },
    [contentType]
  )

  const handleClearReview = () => {
    if (typeof contentType !== 'string') return

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getReviewStatusKey(contentType))
        setReviewStatus({})
      } catch (error) {
        console.error('Error clearing review status:', error)
      }
    }
  }

  const handleExportToMarkdown = () => {
    if (!cache || typeof contentType !== 'string') return

    const starredPaths = cache.paths.filter((p) => p.starred === true)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

    const markdownLines = starredPaths.map((qaPath) => {
      const isReviewed = reviewStatus[qaPath.path] || false
      const checkbox = isReviewed ? '- [x]' : '- [ ]'
      const localLink = `[${qaPath.path}](${baseUrl}${qaPath.path})`
      const prodLink = `[prod](https://www.va.gov${qaPath.path})`

      return `${checkbox} ${localLink} | ${prodLink}`
    })

    const markdown = markdownLines.join('\n')

    // Display in textarea
    setExportedMarkdown(markdown)
  }

  if (typeof contentType !== 'string') {
    return (
      <div className="vads-u-padding--3">
        <p>Loading...</p>
      </div>
    )
  }

  const starredPaths = cache?.paths.filter((p) => p.starred === true) || []
  const unstarredPaths = cache?.paths.filter((p) => p.starred !== true) || []

  return (
    <div className="vads-u-padding--3">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h1 className="vads-u-font-size--h2 vads-u-margin-top--0">
          QA Review - {contentType}
        </h1>
        <button
          className="usa-button usa-button-secondary"
          onClick={handleClearReview}
          disabled={Object.keys(reviewStatus).length === 0}
        >
          Clear Review
        </button>
      </div>

      {error && (
        <div className="usa-alert usa-alert--error vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && <p className="vads-u-color--gray">Loading...</p>}

      {cache && (
        <>
          <div style={{ marginTop: '24px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              Starred Paths ({starredPaths.length})
            </h2>
            {starredPaths.length === 0 ? (
              <p style={{ color: '#757575' }}>No starred paths to review.</p>
            ) : (
              <div
                style={{
                  display: 'table',
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #d6d7d9',
                }}
              >
                <div
                  style={{
                    display: 'table-header-group',
                    backgroundColor: '#f0f0f0',
                    fontWeight: 'bold',
                  }}
                >
                  <div style={{ display: 'table-row' }}>
                    <div
                      style={{
                        display: 'table-cell',
                        padding: '8px 12px',
                        width: '160px',
                      }}
                    >
                      Reviewed
                    </div>
                    <div
                      style={{
                        display: 'table-cell',
                        padding: '8px 12px',
                      }}
                    >
                      Path
                    </div>
                  </div>
                </div>
                <div style={{ display: 'table-row-group' }}>
                  {starredPaths.map((qaPath) => (
                    <ReviewRow
                      key={qaPath.path}
                      qaPath={qaPath}
                      reviewed={reviewStatus[qaPath.path] || false}
                      onReviewToggle={handleReviewToggle}
                    />
                  ))}
                </div>
              </div>
            )}

            {starredPaths.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <button
                  className="usa-button usa-button--outline"
                  onClick={handleExportToMarkdown}
                >
                  Export to Markdown
                </button>
                {exportedMarkdown && (
                  <div style={{ marginTop: '16px' }}>
                    <label
                      htmlFor="markdown-export"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                      }}
                    >
                      Markdown:
                    </label>
                    <textarea
                      id="markdown-export"
                      readOnly
                      value={exportedMarkdown}
                      rows={Math.min(20, starredPaths.length + 2)}
                      style={{
                        width: '100%',
                        maxWidth: 'unset',
                        padding: '8px',
                        border: '1px solid #757575',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                      onClick={(e) => {
                        e.currentTarget.select()
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {unstarredPaths.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <details
                open={unstarredExpanded}
                onToggle={(e) => setUnstarredExpanded(e.currentTarget.open)}
              >
                <summary
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '16px',
                  }}
                >
                  Unstarred Paths ({unstarredPaths.length})
                </summary>
                {unstarredExpanded && (
                  <div
                    style={{
                      display: 'table',
                      width: '100%',
                      borderCollapse: 'collapse',
                      border: '1px solid #d6d7d9',
                    }}
                  >
                    <div
                      style={{
                        display: 'table-header-group',
                        backgroundColor: '#f0f0f0',
                        fontWeight: 'bold',
                      }}
                    >
                      <div style={{ display: 'table-row' }}>
                        <div
                          style={{
                            display: 'table-cell',
                            padding: '8px 12px',
                          }}
                        >
                          Path
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'table-row-group' }}>
                      {unstarredPaths.map((qaPath) => (
                        <div
                          key={qaPath.path}
                          style={{
                            display: 'table-row',
                          }}
                        >
                          <div
                            style={{
                              display: 'table-cell',
                              padding: '8px 12px',
                              verticalAlign: 'top',
                              borderTop: '1px solid #d6d7d9',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <a
                                href={qaPath.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#005ea2',
                                  textDecoration: 'underline',
                                }}
                              >
                                {qaPath.path}
                              </a>
                              <span style={{ color: '#757575' }}>|</span>
                              <a
                                href={`https://www.va.gov${qaPath.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#005ea2',
                                  textDecoration: 'underline',
                                }}
                              >
                                (prod)
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </details>
            </div>
          )}
        </>
      )}
    </div>
  )
}

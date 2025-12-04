import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface ComparisonRecord {
  env1: string
  env2: string
  selector: string
  success: boolean
  message: string
  timestamp: string
  culprits?: [string, string]
  testName?: string
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

interface ReviewStatus {
  [path: string]: boolean
}

interface ChecklistStatus {
  [path: string]: Record<string, boolean>
}

interface ReviewRowProps {
  qaPath: QAPath
  reviewed: boolean
  onReviewToggle: (path: string, reviewed: boolean) => void
  checklistState: Record<string, boolean>
  onChecklistToggle: (path: string, itemId: string) => void
  onCompare: (path: string, env1: string, env2: string) => void
  comparisons: ComparisonRecord[]
  onDeleteComparison: (path: string, index: number) => void
  cssSelector: string
  comparingKeys: Set<string>
}

const QA_CHECKLIST = {
  'Visual/UI': [
    'Visual changes match design/requirements',
    'No unintended visual regressions on other parts of the page',
    'Responsive design works across breakpoints',
  ],
  Functionality: [
    'Feature/PR requirement is fully functional',
    'All interactive elements work as expected',
    'Error states handle gracefully',
  ],
  Accessibility: [
    'Keyboard navigation works correctly',
    'Screen reader announcements are appropriate',
    'Color contrast meets WCAG standards',
    'Focus indicators are visible',
  ],
  Content: [
    'All text content renders correctly',
    'Links are valid and functional',
    'Images have appropriate alt text',
  ],
  Performance: [
    'Page loads without console errors',
    'No performance regressions',
    'Build completes successfully',
  ],
  'Cross-browser': [
    'Tested in Chrome/Safari/Firefox',
    'Mobile browser testing completed',
  ],
  'Data/Integration': [
    'CMS data renders correctly',
    'API calls succeed',
    'Edge cases handled (missing data, long content, etc.)',
  ],
}

const ReviewRow = React.memo<ReviewRowProps>(
  ({
    qaPath,
    reviewed,
    onReviewToggle,
    checklistState,
    onChecklistToggle,
    onCompare,
    comparisons,
    onDeleteComparison,
    cssSelector,
    comparingKeys,
  }) => {
    const isComparingDevStaging = comparingKeys.has(
      `${qaPath.path}:dev:staging`
    )
    const isComparingDevProd = comparingKeys.has(`${qaPath.path}:dev:prod`)
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
              href={`https://staging.va.gov${qaPath.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              (staging)
            </a>
            {comparisons &&
              comparisons.some(
                (c) => c.success && c.env1 === 'dev' && c.env2 === 'staging'
              ) && (
                <va-icon
                  icon="check_circle"
                  size={3}
                  style={{ color: '#00a91c', marginLeft: '4px' }}
                />
              )}
            <span style={{ color: '#757575' }}>|</span>
            <a
              href={`https://www.va.gov${qaPath.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              (prod)
            </a>
            {comparisons &&
              comparisons.some(
                (c) => c.success && c.env1 === 'dev' && c.env2 === 'prod'
              ) && (
                <va-icon
                  icon="check_circle"
                  size={3}
                  style={{ color: '#00a91c', marginLeft: '4px' }}
                />
              )}
          </div>
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              className="usa-button usa-button--outline"
              style={{ fontSize: '12px', padding: '4px 8px' }}
              onClick={() => onCompare(qaPath.path, 'dev', 'staging')}
              disabled={!cssSelector || isComparingDevStaging}
              title={
                !cssSelector
                  ? 'Enter a CSS selector first'
                  : 'Compare dev vs staging'
              }
            >
              {isComparingDevStaging ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      border: '2px solid currentColor',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  {' Comparing...'}
                </>
              ) : (
                'Compare dev/staging'
              )}
            </button>
            <button
              type="button"
              className="usa-button usa-button--outline"
              style={{ fontSize: '12px', padding: '4px 8px' }}
              onClick={() => onCompare(qaPath.path, 'dev', 'prod')}
              disabled={!cssSelector || isComparingDevProd}
              title={
                !cssSelector
                  ? 'Enter a CSS selector first'
                  : 'Compare dev vs prod'
              }
            >
              {isComparingDevProd ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      border: '2px solid currentColor',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  />
                  {' Comparing...'}
                </>
              ) : (
                'Compare dev/prod'
              )}
            </button>
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
          <details style={{ marginTop: '12px' }}>
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#005ea2',
              }}
            >
              QA Checklist
            </summary>
            <div style={{ marginTop: '12px', marginLeft: '8px' }}>
              {Object.entries(QA_CHECKLIST).map(([section, items]) => (
                <div key={section} style={{ marginBottom: '16px' }}>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      marginTop: 0,
                    }}
                  >
                    {section}
                  </h4>
                  {items.map((item) => {
                    const itemId = `${qaPath.path}-${section}-${item}`
                    return (
                      <div
                        key={item}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '6px',
                          marginLeft: '1rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checklistState[itemId] || false}
                          onChange={() =>
                            onChecklistToggle(qaPath.path, itemId)
                          }
                          id={itemId}
                        />
                        <label
                          htmlFor={itemId}
                          style={{
                            cursor: 'pointer',
                            fontSize: '13px',
                            margin: 0,
                          }}
                        >
                          {item}
                        </label>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </details>
          {comparisons && comparisons.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#e7f6f8',
                borderRadius: '4px',
                border: '1px solid #97d4ea',
              }}
            >
              <strong>Comparisons ({comparisons.length}):</strong>
              {comparisons.map((comp, index) => (
                <div
                  key={index}
                  style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: index > 0 ? '1px solid #97d4ea' : 'none',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <va-icon
                          icon={comp.success ? 'check_circle' : 'warning'}
                          size={3}
                          style={{
                            color: comp.success ? '#00a91c' : '#ffbe2e',
                          }}
                        />
                        <strong>
                          {comp.env1} vs {comp.env2}
                        </strong>
                        {' - '}
                        <code style={{ fontSize: '12px' }}>
                          {comp.selector}
                        </code>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          marginTop: '4px',
                          color: '#565c65',
                        }}
                      >
                        {comp.message}
                      </div>
                      {comp.culprits && comp.culprits.length === 2 && (
                        <div
                          style={{
                            fontSize: '12px',
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#fef3cd',
                            borderRadius: '4px',
                            border: '1px solid #ffbe2e',
                          }}
                        >
                          <div
                            style={{ fontWeight: 'bold', marginBottom: '4px' }}
                          >
                            Culprits:
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong>{comp.env1}:</strong>{' '}
                            <code
                              style={{
                                backgroundColor: '#fff',
                                padding: '2px 4px',
                                borderRadius: '2px',
                                fontSize: '11px',
                              }}
                            >
                              {comp.culprits[0]}
                            </code>
                          </div>
                          <div>
                            <strong>{comp.env2}:</strong>{' '}
                            <code
                              style={{
                                backgroundColor: '#fff',
                                padding: '2px 4px',
                                borderRadius: '2px',
                                fontSize: '11px',
                              }}
                            >
                              {comp.culprits[1]}
                            </code>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: '12px',
                          marginTop: '4px',
                          color: '#757575',
                        }}
                      >
                        {new Date(comp.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteComparison(qaPath.path, index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#b50909',
                        fontSize: '12px',
                        padding: '4px 8px',
                        marginLeft: '8px',
                      }}
                      title="Delete this comparison"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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

const getChecklistStatusKey = (contentType: string): string => {
  return `qa-checklist-${contentType}`
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

const loadChecklistStatus = (contentType: string): ChecklistStatus => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(getChecklistStatusKey(contentType))
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const saveChecklistStatus = (
  contentType: string,
  status: ChecklistStatus
): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      getChecklistStatusKey(contentType),
      JSON.stringify(status)
    )
  } catch (error) {
    console.error('Error saving checklist status:', error)
  }
}

const DEFAULT_COMPARISON_SELECTOR = 'main #content, #content main'

export default function QAReviewPage() {
  const router = useRouter()
  const { 'content-type': contentType } = router.query

  const [cache, setCache] = useState<QACache | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>({})
  const [checklistStatus, setChecklistStatus] = useState<ChecklistStatus>({})
  const [unstarredExpanded, setUnstarredExpanded] = useState<boolean>(false)
  const [exportedMarkdown, setExportedMarkdown] = useState<string | null>(null)
  const [exportedComparisons, setExportedComparisons] = useState<string | null>(
    null
  )
  const [cssSelector, setCssSelector] = useState<string>(
    DEFAULT_COMPARISON_SELECTOR
  )
  const [comparingKeys, setComparingKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof contentType === 'string') {
      setReviewStatus(loadReviewStatus(contentType))
      setChecklistStatus(loadChecklistStatus(contentType))
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

  const handleChecklistToggle = React.useCallback(
    (path: string, itemId: string) => {
      if (typeof contentType !== 'string') return

      setChecklistStatus((prev) => {
        const pathChecklist = prev[path] || {}
        const newStatus = {
          ...prev,
          [path]: {
            ...pathChecklist,
            [itemId]: !pathChecklist[itemId],
          },
        }
        saveChecklistStatus(contentType, newStatus)
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
        localStorage.removeItem(getChecklistStatusKey(contentType))
        setReviewStatus({})
        setChecklistStatus({})
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
      const stagingLink = `[staging](https://staging.va.gov${qaPath.path})`
      const prodLink = `[prod](https://www.va.gov${qaPath.path})`

      return `${checkbox} ${localLink} | ${stagingLink} | ${prodLink}`
    })

    const markdown = markdownLines.join('\n')

    // Display in textarea
    setExportedMarkdown(markdown)
  }

  const handleExportComparisons = () => {
    if (!cache) return

    const pathsWithComparisons = cache.paths.filter(
      (p) => p.starred && p.comparisons && p.comparisons.length > 0
    )

    if (pathsWithComparisons.length === 0) {
      setExportedComparisons('No comparison results to export')
      return
    }

    const markdownLines: string[] = ['# QA Comparison Results\n']

    pathsWithComparisons.forEach((qaPath) => {
      markdownLines.push(`## ${qaPath.path}\n`)

      qaPath.comparisons?.forEach((comp, index) => {
        const statusIcon = comp.success ? '✓' : '⚠'
        const statusText = comp.success ? 'PASS' : 'FAIL'
        const date = new Date(comp.timestamp).toLocaleString()
        markdownLines.push(
          `### Comparison ${index + 1} [${statusIcon} ${statusText}]`
        )
        markdownLines.push(`- **Environments:** ${comp.env1} vs ${comp.env2}`)
        markdownLines.push(`- **Selector:** \`${comp.selector}\``)
        markdownLines.push(`- **Result:** ${comp.message}`)
        if (comp.culprits && comp.culprits.length === 2) {
          markdownLines.push(`- **Culprits:**`)
          markdownLines.push(`  - **${comp.env1}:** \`${comp.culprits[0]}\``)
          markdownLines.push(`  - **${comp.env2}:** \`${comp.culprits[1]}\``)
        }
        markdownLines.push(`- **Date:** ${date}\n`)
      })

      markdownLines.push('')
    })

    const markdown = markdownLines.join('\n')
    setExportedComparisons(markdown)
  }

  const handleCompare = React.useCallback(
    async (path: string, env1: string, env2: string) => {
      if (!cssSelector || typeof contentType !== 'string') {
        return
      }

      const key = `${path}:${env1}:${env2}`
      setComparingKeys((prev) => new Set(prev).add(key))

      try {
        // Fetch comparison
        const fetchResponse = await fetch('/api/qa/fetch-comparison', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path,
            environment1: env1,
            environment2: env2,
            selector: cssSelector,
          }),
        })

        const fetchData = await fetchResponse.json()

        if (!fetchResponse.ok) {
          throw new Error(fetchData.message || 'Failed to compare pages')
        }

        // Automatically add comparison
        const comparison: ComparisonRecord = {
          env1,
          env2,
          selector: cssSelector,
          success: fetchData.success,
          message: fetchData.message,
          timestamp: new Date().toISOString(),
          culprits: fetchData.culprits,
          testName: fetchData.testName,
        }

        const saveResponse = await fetch('/api/qa/paths', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            addComparison: comparison,
          }),
        })

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json()
          throw new Error(errorData.error || 'Failed to save comparison')
        }

        const updatedPath = await saveResponse.json()

        // Update local cache
        setCache((prev) => {
          if (!prev) return null
          return {
            ...prev,
            paths: prev.paths.map((p) => (p.path === path ? updatedPath : p)),
          }
        })
      } catch (err) {
        console.error('Error comparing pages:', err)
      } finally {
        setComparingKeys((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }
    },
    [cssSelector, contentType]
  )

  const handleDeleteComparison = React.useCallback(
    async (path: string, index: number) => {
      if (typeof contentType !== 'string') return

      try {
        const response = await fetch('/api/qa/paths', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            deleteComparisonIndex: index,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete comparison')
        }

        const updatedPath = await response.json()

        // Update local cache
        setCache((prev) => {
          if (!prev) return null
          return {
            ...prev,
            paths: prev.paths.map((p) => (p.path === path ? updatedPath : p)),
          }
        })
      } catch (err) {
        console.error('Error deleting comparison:', err)
      }
    },
    [contentType]
  )

  if (typeof contentType !== 'string') {
    return (
      <div className="vads-u-padding--3">
        <p>Loading...</p>
      </div>
    )
  }

  const starredPaths = cache?.paths.filter((p) => p.starred === true) || []
  const unstarredPaths = cache?.paths.filter((p) => p.starred !== true) || []

  const hasAnyChecklistItems = Object.values(checklistStatus).some(
    (pathChecklist) => Object.values(pathChecklist).some((checked) => checked)
  )
  const hasAnyData =
    Object.keys(reviewStatus).length > 0 || hasAnyChecklistItems

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
          disabled={!hasAnyData}
        >
          Clear Review
        </button>
      </div>

      <div className="vads-u-margin-y--3">
        <label
          className="vads-u-display--block vads-u-margin-bottom--1"
          htmlFor="cssSelector"
        >
          CSS Selector for Comparison
        </label>
        <input
          id="cssSelector"
          type="text"
          className="usa-input"
          value={cssSelector}
          onChange={(e) => setCssSelector(e.target.value)}
          placeholder="e.g., main, #content, .my-class"
          style={{ maxWidth: '600px' }}
        />
        <p
          className="vads-u-margin-top--1 vads-u-color--gray-medium"
          style={{ fontSize: '14px' }}
        >
          Enter a CSS selector to target specific elements when comparing pages.
          Default is &quot;{DEFAULT_COMPARISON_SELECTOR}&quot;.
        </p>
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
                      checklistState={checklistStatus[qaPath.path] || {}}
                      onChecklistToggle={handleChecklistToggle}
                      onCompare={handleCompare}
                      comparisons={qaPath.comparisons || []}
                      onDeleteComparison={handleDeleteComparison}
                      cssSelector={cssSelector}
                      comparingKeys={comparingKeys}
                    />
                  ))}
                </div>
              </div>
            )}

            {starredPaths.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="usa-button usa-button--outline"
                    onClick={handleExportToMarkdown}
                  >
                    Export Review Checklist
                  </button>
                  <button
                    className="usa-button usa-button--outline"
                    onClick={handleExportComparisons}
                  >
                    Export Comparisons
                  </button>
                </div>
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
                      Review Checklist Markdown:
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
                {exportedComparisons && (
                  <div style={{ marginTop: '16px' }}>
                    <label
                      htmlFor="comparisons-export"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                      }}
                    >
                      Comparison Results Markdown:
                    </label>
                    <textarea
                      id="comparisons-export"
                      readOnly
                      value={exportedComparisons}
                      rows={Math.min(
                        30,
                        exportedComparisons.split('\n').length
                      )}
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
                                href={`https://staging.va.gov${qaPath.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#005ea2',
                                  textDecoration: 'underline',
                                }}
                              >
                                (staging)
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

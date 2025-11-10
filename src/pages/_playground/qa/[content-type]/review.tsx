import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

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

  const handleReviewToggle = (path: string, reviewed: boolean) => {
    if (typeof contentType !== 'string') return

    const newStatus = {
      ...reviewStatus,
      [path]: reviewed,
    }
    setReviewStatus(newStatus)
    saveReviewStatus(contentType, newStatus)
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
      <h1 className="vads-u-font-size--h2 vads-u-margin-top--0">
        QA Review - {contentType}
      </h1>

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
          <div className="vads-u-margin-top--3">
            <h2 className="vads-u-font-size--h3">
              Starred Paths ({starredPaths.length})
            </h2>
            {starredPaths.length === 0 ? (
              <p className="vads-u-color--gray">No starred paths to review.</p>
            ) : (
              <ul
                className="vads-u-margin-top--2"
                style={{ listStyle: 'none' }}
              >
                {starredPaths.map((qaPath) => (
                  <li
                    key={qaPath.path}
                    className="vads-u-margin-bottom--2 vads-u-padding--2"
                  >
                    <div className="vads-u-display--flex vads-u-align-items--center vads-u-gap--2">
                      <input
                        type="checkbox"
                        checked={reviewStatus[qaPath.path] || false}
                        onChange={(e) =>
                          handleReviewToggle(qaPath.path, e.target.checked)
                        }
                        className="usa-checkbox"
                        id={`review-${qaPath.path}`}
                      />
                      <label
                        htmlFor={`review-${qaPath.path}`}
                        className="vads-u-margin--0"
                      >
                        Reviewed
                      </label>
                      <Link
                        href={qaPath.path}
                        className="vads-u-text-decoration--none"
                      >
                        {qaPath.path}
                      </Link>
                      <span className="vads-u-color--gray">|</span>
                      <a
                        href={`https://www.va.gov${qaPath.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vads-u-text-decoration--none"
                      >
                        (prod)
                      </a>
                    </div>
                    {qaPath.notes && (
                      <div className="vads-u-margin-top--2 vads-u-padding--2 vads-u-background-color--gray-lightest">
                        <strong>Notes:</strong>
                        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                          {qaPath.notes}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {unstarredPaths.length > 0 && (
            <div className="vads-u-margin-top--3">
              <details>
                <summary className="vads-u-font-size--h4">
                  Unstarred Paths ({unstarredPaths.length})
                </summary>
                <ul
                  className="vads-u-margin-top--2"
                  style={{ listStyle: 'none' }}
                >
                  {unstarredPaths.map((qaPath) => (
                    <li
                      key={qaPath.path}
                      className="vads-u-margin-bottom--2 vads-u-padding--2"
                    >
                      <div className="vads-u-display--flex vads-u-align-items--center vads-u-gap--2">
                        <Link
                          href={qaPath.path}
                          className="vads-u-text-decoration--none"
                        >
                          {qaPath.path}
                        </Link>
                        <span className="vads-u-color--gray">|</span>
                        <a
                          href={`https://www.va.gov${qaPath.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vads-u-text-decoration--none"
                        >
                          (prod)
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </>
      )}
    </div>
  )
}

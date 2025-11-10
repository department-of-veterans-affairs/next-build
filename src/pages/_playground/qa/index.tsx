import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PAGE_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

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

const resourceTypeOptions = [...PAGE_RESOURCE_TYPES].sort()

const isDevMode = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development'
  }
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost')
  )
}

const getCacheAgeInDays = (lastFetched?: string): number | null => {
  if (!lastFetched) return null
  const lastFetchedDate = new Date(lastFetched)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - lastFetchedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default function QAPage() {
  const [resourceType, setResourceType] = useState<string>(
    'node--health_care_local_facility'
  )
  const [cache, setCache] = useState<QACache | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [devMode, setDevMode] = useState<boolean>(false)

  // Check dev mode on mount
  useEffect(() => {
    setDevMode(isDevMode())
  }, [])

  const handleFetchPaths = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/qa/paths?resourceType=${encodeURIComponent(resourceType)}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch paths')
      }

      const data = await response.json()
      setCache(data)
    } catch (err) {
      console.error('Error fetching paths:', err)
      setError(err.message || 'An error occurred while fetching paths')
    } finally {
      setLoading(false)
    }
  }

  const handleRevalidateCache = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/qa/paths?resourceType=${encodeURIComponent(
          resourceType
        )}&revalidate=true`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to revalidate cache')
      }

      const data = await response.json()
      setCache(data)
    } catch (err) {
      console.error('Error revalidating cache:', err)
      setError(err.message || 'An error occurred while revalidating cache')
    } finally {
      setLoading(false)
    }
  }

  const handleStarToggle = async (path: string, starred: boolean) => {
    try {
      const response = await fetch('/api/qa/paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType,
          path,
          starred,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update path')
      }

      const updatedPath = await response.json()

      // Update local state
      setCache((prev) => {
        if (!prev) return null
        return {
          ...prev,
          paths: prev.paths.map((p) => (p.path === path ? updatedPath : p)),
        }
      })
    } catch (err) {
      console.error('Error updating path:', err)
      setError(err.message || 'An error occurred while updating path')
    }
  }

  const debouncedUpdateNotes = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null
      return (path: string, notes: string) => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(async () => {
          try {
            const response = await fetch('/api/qa/paths', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                resourceType,
                path,
                notes,
              }),
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error || 'Failed to update notes')
            }

            const updatedPath = await response.json()

            // Update local state
            setCache((prev) => {
              if (!prev) return null
              return {
                ...prev,
                paths: prev.paths.map((p) =>
                  p.path === path ? updatedPath : p
                ),
              }
            })
          } catch (err) {
            console.error('Error updating notes:', err)
            setError(err.message || 'An error occurred while updating notes')
          }
        }, 500)
      }
    })(),
    [resourceType]
  )

  const handleNotesChange = (path: string, notes: string) => {
    // Update local state immediately
    setCache((prev) => {
      if (!prev) return null
      return {
        ...prev,
        paths: prev.paths.map((p) => (p.path === path ? { ...p, notes } : p)),
      }
    })

    // Debounce the API call
    debouncedUpdateNotes(path, notes)
  }

  const cacheAgeInDays = cache ? getCacheAgeInDays(cache.lastFetched) : null
  const isCacheOld = cacheAgeInDays !== null && cacheAgeInDays > 7

  return (
    <div className="vads-u-padding--3">
      <h1 className="vads-u-font-size--h2 vads-u-margin-top--0">QA Tool</h1>

      {!devMode && (
        <div className="usa-alert usa-alert--warning vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Development Mode Required</h3>
            <p>
              Changes can only be saved if you view the page on your local dev
              server, because changes need to be committed to version control.
            </p>
          </div>
        </div>
      )}

      <div className="vads-u-margin-y--3">
        <label
          className="vads-u-display--block vads-u-margin-bottom--1"
          htmlFor="resourceType"
        >
          Content Type
        </label>
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-gap--2">
          <select
            id="resourceType"
            className="usa-select"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            style={{ flex: 1 }}
          >
            {resourceTypeOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button
            className="usa-button"
            onClick={handleFetchPaths}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View paths for content type'}
          </button>
        </div>
      </div>

      <div className="vads-u-margin-y--3">
        <Link
          href={`/_playground/qa/${encodeURIComponent(resourceType)}/review`}
          className="usa-button usa-button-secondary"
        >
          Go to review page
        </Link>
      </div>

      {error && (
        <div className="usa-alert usa-alert--error vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {isCacheOld && cache && (
        <div className="usa-alert usa-alert--info vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Cache Outdated</h3>
            <p>
              Cache is {cacheAgeInDays} day{cacheAgeInDays !== 1 ? 's' : ''}{' '}
              old.
            </p>
            <button
              className="usa-button usa-button--outline vads-u-margin-top--2"
              onClick={handleRevalidateCache}
              disabled={loading}
            >
              Revalidate Cache
            </button>
          </div>
        </div>
      )}

      {cache && (
        <div className="vads-u-margin-top--3">
          <h2 className="vads-u-font-size--h3">Paths ({cache.paths.length})</h2>
          <ul className="vads-u-margin-top--2" style={{ listStyle: 'none' }}>
            {cache.paths.map((qaPath) => (
              <li
                key={qaPath.path}
                className={`vads-u-margin-bottom--2 vads-u-padding--2 ${
                  qaPath.starred === true
                    ? 'vads-u-border-color--gold vads-u-border-left--2px vads-u-border-radius--2px'
                    : ''
                }`}
                style={{
                  borderLeftStyle: qaPath.starred === true ? 'solid' : 'none',
                }}
              >
                <div className="vads-u-display--flex vads-u-align-items--center vads-u-gap--2">
                  <input
                    type="checkbox"
                    checked={qaPath.starred === true}
                    onChange={(e) =>
                      handleStarToggle(qaPath.path, e.target.checked)
                    }
                    className="usa-checkbox"
                    id={`star-${qaPath.path}`}
                  />
                  <label
                    htmlFor={`star-${qaPath.path}`}
                    className="vads-u-margin--0"
                  >
                    ⭐
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
                {qaPath.starred === true && (
                  <div className="vads-u-margin-top--2">
                    <label
                      htmlFor={`notes-${qaPath.path}`}
                      className="vads-u-display--block vads-u-margin-bottom--1"
                    >
                      Notes
                    </label>
                    <textarea
                      id={`notes-${qaPath.path}`}
                      className="usa-textarea"
                      value={qaPath.notes || ''}
                      onChange={(e) =>
                        handleNotesChange(qaPath.path, e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

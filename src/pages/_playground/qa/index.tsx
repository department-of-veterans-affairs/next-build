import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
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

interface PathRowProps {
  qaPath: QAPath
  onStarToggle: (path: string, starred: boolean) => void
  onNotesChange: (path: string, notes: string) => void
}

const PathRow = React.memo<PathRowProps>(
  ({ qaPath, onStarToggle, onNotesChange }) => {
    const isStarred = qaPath.starred === true
    const [localNotes, setLocalNotes] = useState(qaPath.notes || '')

    useEffect(() => {
      setLocalNotes(qaPath.notes || '')
    }, [qaPath.notes])

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNotes = e.target.value
      setLocalNotes(newNotes)
      onNotesChange(qaPath.path, newNotes)
    }

    return (
      <div
        style={{
          display: 'table-row',
          borderLeft: isStarred
            ? '2px solid var(--vads-color-warning-darker, #fdb81e)'
            : 'none',
        }}
      >
        <div
          style={{
            display: 'table-cell',
            padding: '14px 16px 12px 20px',
            verticalAlign: 'top',
            width: '60px',
          }}
        >
          <button
            type="button"
            onClick={() => onStarToggle(qaPath.path, !isStarred)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={isStarred ? 'Unstar path' : 'Star path'}
          >
            <va-icon
              icon="star"
              style={{
                color: isStarred
                  ? 'var(--vads-color-warning-darker, #fdb81e)'
                  : 'var(--vads-color-base-lighter)',
                fontSize: '20px',
              }}
            />
          </button>
        </div>
        <div
          style={{
            display: 'table-cell',
            padding: '12px 16px 12px 20px',
            verticalAlign: 'top',
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
            <span style={{ color: '#757575' }}>|</span>
            <a
              href={`https://www.va.gov${qaPath.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              (prod)
            </a>
          </div>
          {isStarred && (
            <div style={{ marginTop: '12px' }}>
              <label
                htmlFor={`notes-${qaPath.path}`}
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 'bold',
                }}
              >
                Notes
              </label>
              <textarea
                id={`notes-${qaPath.path}`}
                value={localNotes}
                onChange={handleNotesChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #757575',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

PathRow.displayName = 'PathRow'

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

type SortOrder =
  | 'none'
  | 'starred-first'
  | 'unstarred-first'
  | 'path-asc'
  | 'path-desc'

export default function QAPage() {
  const router = useRouter()
  const [resourceType, setResourceType] = useState<string>(
    resourceTypeOptions[0]
  )
  const [cache, setCache] = useState<QACache | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [devMode, setDevMode] = useState<boolean>(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')
  const hasInitializedFromUrl = React.useRef(false)

  // Check dev mode on mount
  useEffect(() => {
    setDevMode(isDevMode())
  }, [])

  const loadPathsFromUrl = useCallback(async (resourceTypeParam: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/qa/paths?resourceType=${encodeURIComponent(resourceTypeParam)}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load paths')
      }

      const data = await response.json()
      setCache(data)
    } catch (err) {
      console.error('Error loading paths from URL:', err)
      setError(err.message || 'An error occurred while loading paths')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize from URL query parameter on mount only
  useEffect(() => {
    if (!router.isReady || hasInitializedFromUrl.current) return

    const urlResourceType = router.query.resourceType
    if (typeof urlResourceType === 'string' && urlResourceType) {
      hasInitializedFromUrl.current = true
      setResourceType(urlResourceType)
      // Pre-load paths if resourceType is in URL
      loadPathsFromUrl(urlResourceType)
    } else {
      // Mark as initialized even if no URL param, so URL updates can happen
      hasInitializedFromUrl.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]) // Only run when router becomes ready, not on query changes

  const handleFetchPaths = async () => {
    setLoading(true)
    setError(null)

    // Update URL when fetching paths
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('resourceType', resourceType)
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`
    window.history.pushState({}, '', newUrl)

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

  const handleStarToggle = useCallback(
    async (path: string, starred: boolean) => {
      // Optimistically update local state immediately
      setCache((prev) => {
        if (!prev) return null
        return {
          ...prev,
          paths: prev.paths.map((p) =>
            p.path === path
              ? {
                  ...p,
                  starred: starred ? true : undefined,
                }
              : p
          ),
        }
      })

      // Then make the API call in the background
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

        // Update with server response to ensure consistency
        setCache((prev) => {
          if (!prev) return null
          return {
            ...prev,
            paths: prev.paths.map((p) => (p.path === path ? updatedPath : p)),
          }
        })
      } catch (err) {
        console.error('Error updating path:', err)
        // Revert the optimistic update on error
        setCache((prev) => {
          if (!prev) return null
          return {
            ...prev,
            paths: prev.paths.map((p) =>
              p.path === path
                ? {
                    ...p,
                    starred: starred ? undefined : true,
                  }
                : p
            ),
          }
        })
        setError(err.message || 'An error occurred while updating path')
      }
    },
    [resourceType]
  )

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

  const handleNotesChange = useCallback(
    (path: string, notes: string) => {
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
    },
    [debouncedUpdateNotes]
  )

  const cacheAgeInDays = cache ? getCacheAgeInDays(cache.lastFetched) : null
  const isCacheOld = cacheAgeInDays !== null && cacheAgeInDays > 7

  const sortedPaths = useMemo(() => {
    if (!cache) return []
    if (sortOrder === 'none') return cache.paths

    if (sortOrder === 'path-asc' || sortOrder === 'path-desc') {
      const sorted = [...cache.paths].sort((a, b) => {
        const comparison = a.path.localeCompare(b.path)
        return sortOrder === 'path-asc' ? comparison : -comparison
      })
      return sorted
    }

    const starred = cache.paths.filter((p) => p.starred === true)
    const unstarred = cache.paths.filter((p) => p.starred !== true)

    if (sortOrder === 'starred-first') {
      return [...starred, ...unstarred]
    } else {
      return [...unstarred, ...starred]
    }
  }, [cache, sortOrder])

  const handleStarSortToggle = () => {
    setSortOrder((prev) => {
      if (prev === 'none' || prev === 'path-asc' || prev === 'path-desc')
        return 'starred-first'
      if (prev === 'starred-first') return 'unstarred-first'
      return 'none'
    })
  }

  const handlePathSortToggle = () => {
    setSortOrder((prev) => {
      if (
        prev === 'none' ||
        prev === 'starred-first' ||
        prev === 'unstarred-first'
      )
        return 'path-asc'
      if (prev === 'path-asc') return 'path-desc'
      return 'none'
    })
  }

  const handleDownloadStarsAndNotes = () => {
    if (!cache) return

    const jsonString = JSON.stringify(cache, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${cache.resourceType}-qa-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
        <div
          className="vads-u-display--flex vads-u-align-items--center"
          style={{ gap: '8px' }}
        >
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
        <div
          className="vads-u-display--flex"
          style={{ gap: '8px', alignItems: 'center' }}
        >
          <a
            href={`/_playground/qa/${encodeURIComponent(resourceType)}/review`}
            className="usa-button usa-button-secondary"
          >
            Go to review page
          </a>
          <button
            className="usa-button usa-button-secondary"
            onClick={handleDownloadStarsAndNotes}
            disabled={!cache}
          >
            Download stars and notes
          </button>
        </div>
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
        <div style={{ marginTop: '24px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            Paths ({cache.paths.length})
          </h2>
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
                  onClick={handleStarSortToggle}
                  style={{
                    display: 'table-cell',
                    padding: '14px 16px',
                    width: '60px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  title={`Click to sort: ${sortOrder === 'none' || sortOrder === 'path-asc' || sortOrder === 'path-desc' ? 'Starred First' : sortOrder === 'starred-first' ? 'Unstarred First' : 'None'}`}
                >
                  Star
                  <span
                    style={{
                      marginLeft: '4px',
                      fontSize: '12px',
                      display: 'inline-block',
                      width: '12px',
                      textAlign: 'left',
                      verticalAlign: 'middle',
                    }}
                  >
                    {sortOrder === 'starred-first'
                      ? '↑'
                      : sortOrder === 'unstarred-first'
                        ? '↓'
                        : ''}
                  </span>
                </div>
                <div
                  onClick={handlePathSortToggle}
                  style={{
                    display: 'table-cell',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  title={`Click to sort: ${sortOrder === 'none' || sortOrder === 'starred-first' || sortOrder === 'unstarred-first' ? 'Path A-Z' : sortOrder === 'path-asc' ? 'Path Z-A' : 'None'}`}
                >
                  Path
                  <span
                    style={{
                      marginLeft: '4px',
                      fontSize: '12px',
                      display: 'inline-block',
                      width: '12px',
                      textAlign: 'left',
                      verticalAlign: 'middle',
                    }}
                  >
                    {sortOrder === 'path-asc'
                      ? '↑'
                      : sortOrder === 'path-desc'
                        ? '↓'
                        : ''}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'table-row-group' }}>
              {sortedPaths.map((qaPath) => (
                <PathRow
                  key={qaPath.path}
                  qaPath={qaPath}
                  onStarToggle={handleStarToggle}
                  onNotesChange={handleNotesChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

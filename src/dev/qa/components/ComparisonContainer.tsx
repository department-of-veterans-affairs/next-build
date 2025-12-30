import * as React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { SideBySideCompare } from './SideBySideCompare'
import styles from './ComparisonContainer.module.css'

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

export interface ComparisonContainerProps {
  comparison: ComparisonRecord
  comparisonIndex: number
  path: string
  contentType: string
  onDelete: () => void
  onUpdate?: (updatedComparison: ComparisonRecord) => void
  onRerunWithSelector?: (newSelector: string) => void | Promise<void>
}

export const ComparisonContainer: React.FC<ComparisonContainerProps> = ({
  comparison,
  comparisonIndex,
  path,
  contentType,
  onDelete,
  onUpdate,
  onRerunWithSelector,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [acceptedDifferences, setAcceptedDifferences] = useState<string[]>(
    comparison.acceptedDifferences || []
  )
  const [comments, setComments] = useState<Record<string, string>>(
    comparison.comments || {}
  )
  const comparisonRef = useRef<HTMLDivElement>(null)
  const [selectorPopoutOpen, setSelectorPopoutOpen] = useState(false)
  const [tempSelector, setTempSelector] = useState(comparison.selector)
  const [isRerunning, setIsRerunning] = useState(false)
  const popoutRef = useRef<HTMLDivElement>(null)

  // Close popout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoutRef.current &&
        !popoutRef.current.contains(event.target as Node)
      ) {
        setSelectorPopoutOpen(false)
        setTempSelector(comparison.selector)
      }
    }
    if (selectorPopoutOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectorPopoutOpen, comparison.selector])

  // Sync tempSelector when comparison.selector changes
  useEffect(() => {
    setTempSelector(comparison.selector)
  }, [comparison.selector])

  const handleSaveSelector = async () => {
    if (onRerunWithSelector && tempSelector !== comparison.selector) {
      setSelectorPopoutOpen(false)
      setIsRerunning(true)
      try {
        await onRerunWithSelector(tempSelector)
      } finally {
        setIsRerunning(false)
      }
    } else {
      setSelectorPopoutOpen(false)
    }
  }

  // Scroll to comparison when it's expanded
  useEffect(() => {
    if (isExpanded && comparisonRef.current) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        comparisonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
    }
  }, [isExpanded])

  const handleAcceptDifference = useCallback(
    async (nodeId: string, differenceIndex: number) => {
      const key = `${nodeId}:${differenceIndex}`
      const newAccepted = [...acceptedDifferences, key]
      setAcceptedDifferences(newAccepted)

      // Persist to server
      try {
        await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            updateComparisonMetadata: {
              comparisonIndex,
              acceptedDifferences: newAccepted,
            },
          }),
        })
      } catch (error) {
        console.error('Error saving accepted difference:', error)
      }
    },
    [acceptedDifferences, comparisonIndex, contentType, path]
  )

  const handleAcceptMultiple = useCallback(
    async (keys: string[]) => {
      const newAccepted = [...acceptedDifferences, ...keys]
      setAcceptedDifferences(newAccepted)

      // Persist to server
      try {
        await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            updateComparisonMetadata: {
              comparisonIndex,
              acceptedDifferences: newAccepted,
            },
          }),
        })
      } catch (error) {
        console.error('Error saving accepted differences:', error)
      }
    },
    [acceptedDifferences, comparisonIndex, contentType, path]
  )

  const handleUnacceptDifference = useCallback(
    async (nodeId: string, differenceIndex: number) => {
      const key = `${nodeId}:${differenceIndex}`
      const newAccepted = acceptedDifferences.filter((k) => k !== key)
      setAcceptedDifferences(newAccepted)

      // Persist to server
      try {
        await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            updateComparisonMetadata: {
              comparisonIndex,
              acceptedDifferences: newAccepted,
            },
          }),
        })
      } catch (error) {
        console.error('Error un-accepting difference:', error)
      }
    },
    [acceptedDifferences, comparisonIndex, contentType, path]
  )

  const handleUnacceptMultiple = useCallback(
    async (keys: string[]) => {
      const keysToRemove = new Set(keys)
      const newAccepted = acceptedDifferences.filter(
        (k) => !keysToRemove.has(k)
      )
      setAcceptedDifferences(newAccepted)

      // Persist to server
      try {
        await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            updateComparisonMetadata: {
              comparisonIndex,
              acceptedDifferences: newAccepted,
            },
          }),
        })
      } catch (error) {
        console.error('Error un-accepting differences:', error)
      }
    },
    [acceptedDifferences, comparisonIndex, contentType, path]
  )

  const handleAddComment = useCallback(
    async (nodeId: string, comment: string) => {
      const newComments = { ...comments, [nodeId]: comment }
      setComments(newComments)

      // Persist to server
      try {
        await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            updateComparisonMetadata: {
              comparisonIndex,
              comments: newComments,
            },
          }),
        })
      } catch (error) {
        console.error('Error saving comment:', error)
      }
    },
    [comments, comparisonIndex, contentType, path]
  )

  const handleSettingsChange = useCallback(
    async (settings: {
      collapseWhitespace: boolean
      includeDataTestId: boolean
    }) => {
      // Persist settings to server
      try {
        await fetch('/api/qa/paths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: contentType,
            path,
            updateComparisonMetadata: {
              comparisonIndex,
              collapseWhitespace: settings.collapseWhitespace,
              includeDataTestId: settings.includeDataTestId,
            },
          }),
        })

        // Notify parent if callback provided
        if (onUpdate) {
          onUpdate({
            ...comparison,
            collapseWhitespace: settings.collapseWhitespace,
            includeDataTestId: settings.includeDataTestId,
          })
        }
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    },
    [comparison, comparisonIndex, contentType, path, onUpdate]
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.title}>
            <strong>
              {comparison.env1} vs {comparison.env2}
            </strong>
            {' - '}
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              ref={popoutRef}
            >
              <button
                type="button"
                onClick={() =>
                  !isRerunning && setSelectorPopoutOpen(!selectorPopoutOpen)
                }
                disabled={isRerunning}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #d6d7d9',
                  borderRadius: '12px',
                  cursor: isRerunning ? 'default' : 'pointer',
                  color: '#1b1b1b',
                  lineHeight: '1.4',
                  opacity: isRerunning ? 0.7 : 1,
                }}
                title={
                  isRerunning ? 'Re-running comparison...' : 'Edit CSS selector'
                }
              >
                {comparison.selector}
                {isRerunning ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        border: '2px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }}
                    />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </>
                ) : (
                  <va-icon icon="build" size={2} />
                )}
              </button>
              {selectorPopoutOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    padding: '12px',
                    backgroundColor: '#fff',
                    border: '1px solid #d6d7d9',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    minWidth: '300px',
                  }}
                >
                  <label
                    htmlFor={`selector-input-${path}-${comparisonIndex}`}
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    CSS Selector
                  </label>
                  <input
                    id={`selector-input-${path}-${comparisonIndex}`}
                    type="text"
                    value={tempSelector}
                    onChange={(e) => setTempSelector(e.target.value)}
                    className="usa-input"
                    style={{
                      width: '100%',
                      marginBottom: '12px',
                      fontSize: '14px',
                    }}
                    placeholder="e.g., main, #content, .my-class"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveSelector()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="usa-button"
                    onClick={handleSaveSelector}
                    style={{ fontSize: '14px', padding: '6px 12px' }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.timestamp}>
            {new Date(comparison.timestamp).toLocaleString()}
          </div>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="usa-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            disabled={isRerunning}
          >
            {isExpanded ? 'Hide' : 'View'} Comparison
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={styles.deleteButton}
            title="Delete this comparison"
            disabled={isRerunning}
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && comparison.html1 && comparison.html2 && (
        <div ref={comparisonRef} className={styles.comparisonContent}>
          <SideBySideCompare
            html1={comparison.html1}
            html2={comparison.html2}
            env1Label={comparison.env1}
            env2Label={comparison.env2}
            onAcceptDifference={handleAcceptDifference}
            onUnacceptDifference={handleUnacceptDifference}
            onAddComment={handleAddComment}
            acceptedDifferences={acceptedDifferences}
            comments={comments}
            onAcceptMultiple={handleAcceptMultiple}
            onUnacceptMultiple={handleUnacceptMultiple}
            initialCollapseWhitespace={comparison.collapseWhitespace}
            initialIncludeDataTestId={comparison.includeDataTestId}
            onSettingsChange={handleSettingsChange}
          />
        </div>
      )}
    </div>
  )
}

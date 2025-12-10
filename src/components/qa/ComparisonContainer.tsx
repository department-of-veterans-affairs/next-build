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
}

export const ComparisonContainer: React.FC<ComparisonContainerProps> = ({
  comparison,
  comparisonIndex,
  path,
  contentType,
  onDelete,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [acceptedDifferences, setAcceptedDifferences] = useState<string[]>(
    comparison.acceptedDifferences || []
  )
  const [comments, setComments] = useState<Record<string, string>>(
    comparison.comments || {}
  )
  const comparisonRef = useRef<HTMLDivElement>(null)

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
            <code className={styles.selector}>{comparison.selector}</code>
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
          >
            {isExpanded ? 'Hide' : 'View'} Comparison
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={styles.deleteButton}
            title="Delete this comparison"
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

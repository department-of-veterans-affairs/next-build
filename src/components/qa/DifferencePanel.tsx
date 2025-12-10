/**
 * DifferencePanel - Displays differences, accepted differences, and comment form
 */

import * as React from 'react'
import { DifferenceDetail } from '@/lib/qa/elementMatcher'
import {
  DifferencePanelProps,
  DifferenceItemProps,
  CommentFormProps,
} from './types'
import { styles } from './styles'
import { useCompare, useDifferences } from './contexts'

// =============================================================================
// Difference Item Component
// =============================================================================

const DifferenceItemComponent: React.FC<DifferenceItemProps> = ({
  difference,
  nodeId,
  differenceIndex,
}) => {
  const { env1Label, env2Label, onAcceptDifference } = useCompare()

  return (
    <div className={styles.diffItem}>
      <div className={styles.diffItemContent}>
        <div className={styles.diffItemDescription}>
          {difference.description}
        </div>
        {difference.leftValue && (
          <div className={styles.diffItemValue}>
            <span
              className={`${styles.diffItemLabel} ${styles.diffItemLabelLeft}`}
            >
              {env1Label}:
            </span>
            {difference.leftValue}
          </div>
        )}
        {difference.rightValue && (
          <div className={styles.diffItemValue}>
            <span
              className={`${styles.diffItemLabel} ${styles.diffItemLabelRight}`}
            >
              {env2Label}:
            </span>
            {difference.rightValue}
          </div>
        )}
      </div>
      {onAcceptDifference && (
        <button
          type="button"
          onClick={() => onAcceptDifference(nodeId, differenceIndex)}
          className={styles.acceptBtn}
        >
          Accept
        </button>
      )}
    </div>
  )
}

const DifferenceItem = React.memo(DifferenceItemComponent)

// =============================================================================
// Comment Form Component
// =============================================================================

const CommentForm: React.FC<CommentFormProps> = ({
  nodeId,
  existingComment,
}) => {
  const { onAddComment } = useCompare()
  const [showCommentForm, setShowCommentForm] = React.useState(false)
  const [commentText, setCommentText] = React.useState('')

  const handleAddComment = () => {
    if (commentText.trim() && onAddComment) {
      onAddComment(nodeId, commentText.trim())
      setCommentText('')
      setShowCommentForm(false)
    }
  }

  if (!onAddComment) {
    return null
  }

  return (
    <>
      {!showCommentForm && (
        <button
          type="button"
          onClick={() => setShowCommentForm(true)}
          className={styles.commentAddBtn}
        >
          {existingComment ? 'Update Comment' : 'Add Comment'}
        </button>
      )}
      {showCommentForm && (
        <div className={styles.commentForm}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter your comment..."
            rows={2}
            className={styles.commentTextarea}
          />
          <div className={styles.commentFormButtons}>
            <button
              type="button"
              onClick={handleAddComment}
              className={styles.commentSaveBtn}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCommentForm(false)
                setCommentText('')
              }}
              className={styles.commentCancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// =============================================================================
// Accepted Differences Section
// =============================================================================

interface AcceptedDifferencesSectionProps {
  acceptedDiffs: { diff: DifferenceDetail; originalIndex: number }[]
  nodeId: string
  includeInNav: boolean
}

const AcceptedDifferencesSectionComponent: React.FC<
  AcceptedDifferencesSectionProps
> = ({ acceptedDiffs, nodeId, includeInNav }) => {
  const { env1Label, env2Label, onUnacceptDifference } = useCompare()
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (acceptedDiffs.length === 0) {
    return null
  }

  // Collapsed state
  if (!isExpanded) {
    return (
      <div
        className={styles.acceptedCollapsed}
        onClick={() => setIsExpanded(true)}
        {...(includeInNav && { 'data-html-difference': true })}
      >
        <va-icon
          icon="expand_more"
          size={3}
          className={styles.acceptedCollapsedIcon}
        />
        <span className={styles.acceptedCollapsedText}>
          {acceptedDiffs.length} accepted difference
          {acceptedDiffs.length !== 1 ? 's' : ''}
        </span>
      </div>
    )
  }

  // Expanded state
  return (
    <div
      className={styles.acceptedExpanded}
      {...(includeInNav && { 'data-html-difference': true })}
    >
      <div
        className={styles.acceptedExpandedHeader}
        onClick={() => setIsExpanded(false)}
      >
        <va-icon
          icon="expand_less"
          size={3}
          className={styles.acceptedCollapsedIcon}
        />
        <span className={styles.acceptedCollapsedText}>
          {acceptedDiffs.length} accepted difference
          {acceptedDiffs.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className={styles.acceptedExpandedContent}>
        {acceptedDiffs.map(({ diff, originalIndex }, idx) => (
          <div key={idx} className={styles.acceptedItem}>
            <div className={styles.acceptedItemContent}>
              <div className={styles.acceptedItemDescription}>
                {diff.description}
              </div>
              {diff.leftValue && (
                <div className={styles.acceptedItemValue}>
                  <span className={styles.acceptedItemLabel}>{env1Label}:</span>{' '}
                  {diff.leftValue}
                </div>
              )}
              {diff.rightValue && (
                <div className={styles.acceptedItemValue}>
                  <span className={styles.acceptedItemLabel}>{env2Label}:</span>{' '}
                  {diff.rightValue}
                </div>
              )}
            </div>
            {onUnacceptDifference && (
              <button
                type="button"
                onClick={() => onUnacceptDifference(nodeId, originalIndex)}
                className={styles.unacceptBtn}
                title="Un-accept this difference"
              >
                Un-accept
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const AcceptedDifferencesSection = React.memo(
  AcceptedDifferencesSectionComponent
)

// =============================================================================
// Main DifferencePanel Component
// =============================================================================

export const DifferencePanel: React.FC<DifferencePanelProps> = ({
  match,
  nodeId,
  existingComment,
}) => {
  const { acceptedDifferencesSet, includeAcceptedInNav } = useDifferences()
  const differences = match.differences

  // Separate accepted and visible differences
  const acceptedDiffs: { diff: DifferenceDetail; originalIndex: number }[] = []
  const visibleDiffs: { diff: DifferenceDetail; originalIndex: number }[] = []

  differences.forEach((diff, idx) => {
    const key = `${nodeId}:${idx}`
    if (acceptedDifferencesSet.has(key)) {
      acceptedDiffs.push({ diff, originalIndex: idx })
    } else {
      visibleDiffs.push({ diff, originalIndex: idx })
    }
  })

  const hasVisibleDifferences = visibleDiffs.length > 0
  const hasAcceptedDifferences = acceptedDiffs.length > 0

  // Don't render if no differences and no comment
  if (!hasVisibleDifferences && !hasAcceptedDifferences && !existingComment) {
    return null
  }

  return (
    <>
      {/* Accepted differences section */}
      <AcceptedDifferencesSection
        acceptedDiffs={acceptedDiffs}
        nodeId={nodeId}
        includeInNav={includeAcceptedInNav}
      />

      {/* Visible (unaccepted) differences and comments */}
      {(hasVisibleDifferences || existingComment) && (
        <div className={styles.diffPanel} data-html-difference>
          {hasVisibleDifferences && (
            <>
              <div className={styles.diffPanelTitle}>Differences:</div>
              {visibleDiffs.map(({ diff, originalIndex }) => (
                <DifferenceItem
                  key={originalIndex}
                  difference={diff}
                  nodeId={nodeId}
                  differenceIndex={originalIndex}
                />
              ))}
            </>
          )}

          {existingComment && (
            <div className={styles.commentDisplay}>
              <div className={styles.commentDisplayTitle}>Comment:</div>
              <div>{existingComment}</div>
            </div>
          )}

          <CommentForm nodeId={nodeId} existingComment={existingComment} />
        </div>
      )}
    </>
  )
}

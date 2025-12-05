import * as React from 'react'
import { HtmlTreeNode, parseHtmlToTree } from '@/lib/qa/htmlTreeParser'
import {
  matchElements,
  MatchedPair,
  getNodeDifferences,
  DifferenceDetail,
} from '@/lib/qa/elementMatcher'

interface SideBySideCompareProps {
  html1: string
  html2: string
  env1Label: string
  env2Label: string
  onAcceptDifference?: (nodeId: string, differenceIndex: number) => void
  onUnacceptDifference?: (nodeId: string, differenceIndex: number) => void
  onAddComment?: (nodeId: string, comment: string) => void
  acceptedDifferences?: string[]
  comments?: Record<string, string>
}

export const SideBySideCompare: React.FC<SideBySideCompareProps> = ({
  html1,
  html2,
  env1Label,
  env2Label,
  onAcceptDifference,
  onUnacceptDifference,
  onAddComment,
  acceptedDifferences = [],
  comments = {},
}) => {
  const [tree1, setTree1] = React.useState<HtmlTreeNode | null>(null)
  const [tree2, setTree2] = React.useState<HtmlTreeNode | null>(null)
  const [matches, setMatches] = React.useState<MatchedPair[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const differenceRefsMap = React.useRef<Map<number, HTMLDivElement>>(new Map())
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [hoveredMatchKey, setHoveredMatchKey] = React.useState<string | null>(
    null
  )
  const [minVisibleDepth, setMinVisibleDepth] = React.useState(0)
  const [currentDifferenceIndex, setCurrentDifferenceIndex] = React.useState(0)
  const [includeAcceptedInNav, setIncludeAcceptedInNav] = React.useState(false)

  const acceptedDifferencesSet = React.useMemo(
    () => new Set(acceptedDifferences),
    [acceptedDifferences]
  )

  const commentsMap = React.useMemo(
    () => new Map(Object.entries(comments)),
    [comments]
  )

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

      const parsedTree1 = parseHtmlToTree(rootElement1)
      const parsedTree2 = parseHtmlToTree(rootElement2)

      setTree1(parsedTree1)
      setTree2(parsedTree2)

      // Match elements between trees
      const matched = matchElements(parsedTree1, parsedTree2)
      setMatches(matched)
    } catch (err) {
      console.error('Error parsing HTML:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [html1, html2])

  // Cleanup scroll timeout on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Get list of matches with differences (for navigation)
  // Must be called before any early returns to maintain hook order
  const matchesWithDifferences = React.useMemo(() => {
    return matches
      .map((match, idx) => ({ match, originalIndex: idx }))
      .filter(({ match }) => {
        if (!match.isDifferent) return false

        // If not including accepted differences, filter them out
        if (!includeAcceptedInNav) {
          const leftNode = match.left?.node
          const rightNode = match.right?.node
          const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
          const nodeId =
            matchKey || `row-${leftNode?.depth ?? rightNode?.depth ?? 0}`
          const differences = getNodeDifferences(
            leftNode || null,
            rightNode || null
          )

          // Check if all differences are accepted
          const allAccepted = differences.every((_, idx) => {
            const key = `${nodeId}:${idx}`
            return acceptedDifferencesSet.has(key)
          })

          return !allAccepted
        }

        return true
      })
  }, [matches, includeAcceptedInNav, acceptedDifferencesSet])

  // Calculate minimum visible depth with scroll position compensation
  const calculateMinVisibleDepth = React.useCallback(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerTop = containerRect.top
    const containerBottom = containerRect.bottom

    // Find all row elements
    const rowElements = container.querySelectorAll('[data-row-depth]')

    let minDepth = Infinity
    let topMostElement: Element | null = null
    let topMostElementTop = Infinity

    rowElements.forEach((el) => {
      const rect = el.getBoundingClientRect()

      // Check if element is visible in viewport (Y-axis)
      if (rect.bottom > containerTop && rect.top < containerBottom) {
        const depth = parseInt(
          (el as HTMLElement).getAttribute('data-row-depth') || '0',
          10
        )

        if (depth < minDepth) {
          minDepth = depth
        }

        // Track the top-most visible element
        if (rect.top < topMostElementTop) {
          topMostElementTop = rect.top
          topMostElement = el
        }
      }
    })

    if (minDepth !== Infinity && minDepth !== minVisibleDepth) {
      // Before updating depth (which triggers reflow), capture top element position
      const topElementOffsetBefore = topMostElement
        ? topMostElement.getBoundingClientRect().top - containerTop
        : 0

      // Update the depth (this will cause reflow)
      setMinVisibleDepth(minDepth)

      // After state updates and reflow, compensate scroll position
      requestAnimationFrame(() => {
        if (topMostElement && scrollContainerRef.current) {
          const topElementOffsetAfter =
            topMostElement.getBoundingClientRect().top - containerTop
          const offsetDiff = topElementOffsetAfter - topElementOffsetBefore

          // Adjust scroll to keep the top element at the same visual position
          if (offsetDiff !== 0) {
            scrollContainerRef.current.scrollTop += offsetDiff
          }
        }
      })
    }
  }, [minVisibleDepth])

  // Debounced scroll handler - updates current difference index and padding
  const handleScroll = React.useCallback(() => {
    // Update current difference index based on scroll position
    if (scrollContainerRef.current && matchesWithDifferences.length > 0) {
      const container = scrollContainerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerCenter = containerTop + containerRect.height / 2

      // Find the difference that's closest to the center of the viewport
      let closestIndex = 0
      let closestDistance = Infinity

      matchesWithDifferences.forEach((item, idx) => {
        const element = differenceRefsMap.current.get(item.originalIndex)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const distance = Math.abs(elementCenter - containerCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = idx
          }
        }
      })

      if (closestIndex !== currentDifferenceIndex) {
        setCurrentDifferenceIndex(closestIndex)
      }
    }

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set new timeout to recalculate after scroll stops (150ms delay)
    scrollTimeoutRef.current = setTimeout(() => {
      calculateMinVisibleDepth()
    }, 150)
  }, [calculateMinVisibleDepth, matchesWithDifferences, currentDifferenceIndex])

  // Build array of rows including closing tags
  // For each element node with children, insert a closing tag row after the last child
  const rowsWithClosingTags = React.useMemo(() => {
    // First, build a map of where closing tags should be inserted
    const closingTagsToInsert: Map<
      number,
      Array<{ match: MatchedPair; matchIndex: number }>
    > = new Map()

    matches.forEach((match, idx) => {
      // Check if this is an element node with children
      const leftNode = match.left?.node
      const rightNode = match.right?.node
      const leftHasChildren =
        leftNode?.type === 'element' &&
        leftNode.children &&
        leftNode.children.length > 0
      const rightHasChildren =
        rightNode?.type === 'element' &&
        rightNode.children &&
        rightNode.children.length > 0

      if (leftHasChildren || rightHasChildren) {
        // Find where the children end by looking at the path depth
        const leftPath = match.left?.path || []
        const rightPath = match.right?.path || []
        const currentPath = leftPath.length > 0 ? leftPath : rightPath

        // Look ahead to find the last descendant
        let lastChildIndex = idx
        for (let j = idx + 1; j < matches.length; j++) {
          const nextMatch = matches[j]
          const nextLeftPath = nextMatch.left?.path || []
          const nextRightPath = nextMatch.right?.path || []
          const nextPath =
            nextLeftPath.length > 0 ? nextLeftPath : nextRightPath

          // Check if next node is a descendant (path starts with current path)
          const isDescendant =
            nextPath.length > currentPath.length &&
            currentPath.every((val, i) => nextPath[i] === val)

          if (isDescendant) {
            lastChildIndex = j
          } else {
            // Not a descendant, we're done with children
            break
          }
        }

        // Mark that we need to insert a closing tag after lastChildIndex
        if (lastChildIndex > idx) {
          if (!closingTagsToInsert.has(lastChildIndex)) {
            closingTagsToInsert.set(lastChildIndex, [])
          }
          closingTagsToInsert
            .get(lastChildIndex)!
            .push({ match, matchIndex: idx })
        }
      }
    })

    // Now build the final rows array
    const rows: Array<
      | { type: 'match'; match: MatchedPair; matchIndex: number }
      | { type: 'closing'; match: MatchedPair; matchIndex: number }
    > = []

    matches.forEach((match, idx) => {
      // Add the opening tag row
      rows.push({ type: 'match', match, matchIndex: idx })

      // Add any closing tags that should come after this row
      const closingTags = closingTagsToInsert.get(idx)
      if (closingTags) {
        // Add in reverse order (innermost to outermost)
        closingTags.reverse().forEach((closing) => {
          rows.push({ type: 'closing', ...closing })
        })
      }
    })

    return rows
  }, [matches])

  const differenceCount = matchesWithDifferences.length

  // Navigate to specific difference
  const goToDifference = React.useCallback(
    (index: number) => {
      if (index < 0 || index >= differenceCount) return

      const { originalIndex } = matchesWithDifferences[index]
      const element = differenceRefsMap.current.get(originalIndex)

      if (element && scrollContainerRef.current) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        setCurrentDifferenceIndex(index)
      }
    },
    [differenceCount, matchesWithDifferences]
  )

  const goToNextDifference = React.useCallback(() => {
    goToDifference((currentDifferenceIndex + 1) % differenceCount)
  }, [currentDifferenceIndex, differenceCount, goToDifference])

  const goToPreviousDifference = React.useCallback(() => {
    goToDifference(
      (currentDifferenceIndex - 1 + differenceCount) % differenceCount
    )
  }, [currentDifferenceIndex, differenceCount, goToDifference])

  // Early returns AFTER all hooks have been called
  if (error) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f4e3db',
          border: '1px solid #b50909',
          borderRadius: '4px',
          color: '#b50909',
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    )
  }

  if (!tree1 || !tree2) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
        Loading comparison...
      </div>
    )
  }

  return (
    <div>
      {/* Comparison Header with Navigation */}
      <div
        style={{
          marginBottom: '12px',
          padding: '16px',
          backgroundColor: '#e7f6f8',
          borderRadius: '4px',
          border: '1px solid #97d4ea',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left side - Summary stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#1b1b1b',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                Comparison Summary
              </div>
              <div style={{ fontSize: '14px', color: '#565c65' }}>
                {matches.length} elements
                {differenceCount > 0 && (
                  <span
                    style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: '#fff3cd',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#936c12',
                    }}
                  >
                    {differenceCount} difference
                    {differenceCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Navigation controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingRight: '12px',
                borderRight: '1px solid #97d4ea',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <input
                type="checkbox"
                id="include-accepted-nav"
                checked={includeAcceptedInNav}
                onChange={(e) => setIncludeAcceptedInNav(e.target.checked)}
                style={{
                  cursor: 'pointer',
                  margin: 0,
                  flexShrink: 0,
                }}
              />
              <label
                htmlFor="include-accepted-nav"
                style={{
                  fontSize: '13px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  margin: 0,
                  color: '#1b1b1b',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Include accepted
              </label>
            </div>
            {differenceCount > 0 ? (
              <>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1b1b1b',
                    minWidth: '100px',
                    textAlign: 'center',
                  }}
                >
                  {currentDifferenceIndex + 1} of {differenceCount}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      goToPreviousDifference()
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#005ea2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Go to previous difference"
                  >
                    <va-icon icon="expand_less" size={3} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      goToNextDifference()
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#005ea2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Go to next difference"
                  >
                    Next
                    <va-icon icon="expand_more" size={3} />
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  fontSize: '13px',
                  color: '#757575',
                  fontStyle: 'italic',
                }}
              >
                {includeAcceptedInNav
                  ? 'No differences found'
                  : 'No unaccepted differences'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison View */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          border: '1px solid #d6d7d9',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '800px',
          width: '100%',
          backgroundColor: '#f9f9f9',
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          <div style={{ flex: '1 1 50%', minWidth: 0 }}>{env1Label}</div>
          <div style={{ flex: '1 1 50%', minWidth: 0 }}>{env2Label}</div>
        </div>
        {rowsWithClosingTags.map((row, idx) => {
          if (row.type === 'closing') {
            return (
              <ClosingTagRow
                key={`closing-${row.matchIndex}`}
                match={row.match}
                hoveredMatchKey={hoveredMatchKey}
                onHoverMatchKey={setHoveredMatchKey}
                minVisibleDepth={minVisibleDepth}
              />
            )
          }

          return (
            <MatchedPairRow
              key={`match-${row.matchIndex}`}
              match={row.match}
              onAcceptDifference={onAcceptDifference}
              onUnacceptDifference={onUnacceptDifference}
              onAddComment={onAddComment}
              acceptedDifferences={acceptedDifferencesSet}
              comments={commentsMap}
              hoveredMatchKey={hoveredMatchKey}
              onHoverMatchKey={setHoveredMatchKey}
              minVisibleDepth={minVisibleDepth}
              rowRef={(el) => {
                if (el && row.match.isDifferent) {
                  differenceRefsMap.current.set(row.matchIndex, el)
                }
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

interface MatchedPairRowProps {
  match: MatchedPair
  onAcceptDifference?: (nodeId: string, differenceIndex: number) => void
  onUnacceptDifference?: (nodeId: string, differenceIndex: number) => void
  onAddComment?: (nodeId: string, comment: string) => void
  acceptedDifferences: Set<string>
  comments: Map<string, string>
  hoveredMatchKey: string | null
  onHoverMatchKey: (matchKey: string | null) => void
  minVisibleDepth: number
  rowRef?: (el: HTMLDivElement | null) => void
}

const MatchedPairRow: React.FC<MatchedPairRowProps> = ({
  match,
  onAcceptDifference,
  onUnacceptDifference,
  onAddComment,
  acceptedDifferences,
  comments,
  hoveredMatchKey,
  onHoverMatchKey,
  minVisibleDepth,
  rowRef,
}) => {
  const [expandedAccepted, setExpandedAccepted] = React.useState<Set<string>>(
    new Set()
  )

  const leftNode = match.left?.node
  const rightNode = match.right?.node
  const depth = leftNode?.depth ?? rightNode?.depth ?? 0
  const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''

  const differences = getNodeDifferences(leftNode || null, rightNode || null)
  const nodeId = matchKey || `row-${depth}`

  // Separate accepted and visible differences
  const acceptedDiffs = differences.filter((diff, idx) => {
    const key = `${nodeId}:${idx}`
    return acceptedDifferences.has(key)
  })

  const visibleDifferences = differences.filter((diff, idx) => {
    const key = `${nodeId}:${idx}`
    return !acceptedDifferences.has(key)
  })

  const hasVisibleDifferences = visibleDifferences.length > 0
  const hasAcceptedDifferences = acceptedDiffs.length > 0
  const existingComment = comments.get(nodeId)
  const isHovered = hoveredMatchKey === matchKey

  // Calculate padding based on depth relative to minimum visible depth
  const normalizedDepth = Math.max(0, depth - minVisibleDepth)

  const toggleAcceptedExpansion = () => {
    setExpandedAccepted((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const isAcceptedExpanded = expandedAccepted.has(nodeId)

  return (
    <div
      ref={rowRef}
      data-row-depth={depth}
      style={{
        marginBottom: '4px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <NodeCell
          node={leftNode}
          isHovered={isHovered}
          hasVisibleDifferences={hasVisibleDifferences}
          onHoverMatchKey={onHoverMatchKey}
          matchKey={matchKey}
          depth={normalizedDepth}
        />
        <div style={{ borderLeft: '1px solid #bbb' }}></div>
        <NodeCell
          node={rightNode}
          isHovered={isHovered}
          hasVisibleDifferences={hasVisibleDifferences}
          onHoverMatchKey={onHoverMatchKey}
          matchKey={matchKey}
          depth={normalizedDepth}
        />
      </div>

      {/* Accepted differences - collapsed state */}
      {hasAcceptedDifferences && !isAcceptedExpanded && (
        <div
          onClick={toggleAcceptedExpansion}
          style={{
            marginTop: '8px',
            marginBottom: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f9f0',
            border: '1px solid #c7e6c7',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#2e7d32',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e8f5e9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f9f0'
          }}
        >
          <va-icon
            icon="expand_more"
            size={3}
            style={{
              color: '#2e7d32',
            }}
          />
          <span style={{ fontWeight: '500' }}>
            {acceptedDiffs.length} accepted difference
            {acceptedDiffs.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Accepted differences - expanded state */}
      {hasAcceptedDifferences && isAcceptedExpanded && (
        <div
          style={{
            marginTop: '8px',
            marginBottom: '4px',
            backgroundColor: '#f0f9f0',
            border: '1px solid #c7e6c7',
            borderRadius: '3px',
            fontSize: '12px',
          }}
        >
          <div
            onClick={toggleAcceptedExpansion}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              color: '#2e7d32',
              borderBottom: '1px solid #c7e6c7',
            }}
          >
            <va-icon
              icon="expand_less"
              size={3}
              style={{
                color: '#2e7d32',
              }}
            />
            <span style={{ fontWeight: '500' }}>
              {acceptedDiffs.length} accepted difference
              {acceptedDiffs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ padding: '8px' }}>
            {acceptedDiffs.map((diff, idx) => {
              const originalIndex = differences.indexOf(diff)
              return (
                <div
                  key={idx}
                  style={{
                    marginBottom: idx < acceptedDiffs.length - 1 ? '8px' : '0',
                    padding: '6px 8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '3px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: '600',
                        fontSize: '11px',
                        color: '#1b1b1b',
                        marginBottom: '4px',
                      }}
                    >
                      {diff.description}
                    </div>
                    {diff.leftValue && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#757575',
                          fontFamily: 'monospace',
                          marginBottom: diff.rightValue ? '2px' : '0',
                          wordBreak: 'break-word',
                        }}
                      >
                        <span style={{ fontWeight: '600', color: '#b50909' }}>
                          Left:
                        </span>{' '}
                        {diff.leftValue}
                      </div>
                    )}
                    {diff.rightValue && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#757575',
                          fontFamily: 'monospace',
                          wordBreak: 'break-word',
                        }}
                      >
                        <span style={{ fontWeight: '600', color: '#2e7d32' }}>
                          Right:
                        </span>{' '}
                        {diff.rightValue}
                      </div>
                    )}
                  </div>
                  {onUnacceptDifference && (
                    <button
                      type="button"
                      onClick={() =>
                        onUnacceptDifference(nodeId, originalIndex)
                      }
                      style={{
                        fontSize: '10px',
                        padding: '3px 8px',
                        backgroundColor: '#ffffff',
                        color: '#b50909',
                        border: '1px solid #b50909',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                      title="Un-accept this difference"
                    >
                      Un-accept
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visible (unaccepted) differences */}
      {(hasVisibleDifferences || existingComment) && (
        <div
          style={{
            marginTop: '4px',
            padding: '8px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffbe2e',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {hasVisibleDifferences && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Differences:
              </div>
              {visibleDifferences.map((diff, idx) => (
                <DifferenceItem
                  key={idx}
                  difference={diff}
                  nodeId={nodeId}
                  differenceIndex={differences.indexOf(diff)}
                  onAccept={onAcceptDifference}
                />
              ))}
            </>
          )}
          {existingComment && (
            <div
              style={{
                marginTop: hasVisibleDifferences ? '8px' : '0',
                padding: '6px',
                backgroundColor: '#e7f6f8',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                Comment:
              </div>
              <div>{existingComment}</div>
            </div>
          )}
          <CommentForm
            nodeId={nodeId}
            existingComment={existingComment}
            onAddComment={onAddComment}
          />
        </div>
      )}
    </div>
  )
}

interface ClosingTagRowProps {
  match: MatchedPair
  hoveredMatchKey: string | null
  onHoverMatchKey: (matchKey: string | null) => void
  minVisibleDepth: number
}

const ClosingTagRow: React.FC<ClosingTagRowProps> = ({
  match,
  hoveredMatchKey,
  onHoverMatchKey,
  minVisibleDepth,
}) => {
  const leftNode = match.left?.node
  const rightNode = match.right?.node
  const depth = leftNode?.depth ?? rightNode?.depth ?? 0
  const matchKey = leftNode?.matchKey ?? rightNode?.matchKey ?? ''
  const isHovered = hoveredMatchKey === matchKey

  const normalizedDepth = Math.max(0, depth - minVisibleDepth)

  return (
    <div
      data-row-depth={depth}
      style={{
        marginBottom: '4px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <ClosingTagCell
          node={leftNode}
          isHovered={isHovered}
          onHoverMatchKey={onHoverMatchKey}
          matchKey={matchKey}
          depth={normalizedDepth}
        />
        <div style={{ borderLeft: '1px solid #bbb' }}></div>
        <ClosingTagCell
          node={rightNode}
          isHovered={isHovered}
          onHoverMatchKey={onHoverMatchKey}
          matchKey={matchKey}
          depth={normalizedDepth}
        />
      </div>
    </div>
  )
}

interface ClosingTagCellProps {
  node: HtmlTreeNode | null | undefined
  isHovered: boolean
  onHoverMatchKey: (matchKey: string | null) => void
  matchKey: string
  depth: number
}

const ClosingTagCell: React.FC<ClosingTagCellProps> = ({
  node,
  isHovered,
  onHoverMatchKey,
  matchKey,
  depth,
}) => {
  const margin = `2px 4px 2px ${depth * 10}px`

  if (!node || node.type !== 'element') {
    return (
      <div
        style={{
          flex: '1 1 50%',
          minWidth: 0,
          margin,
        }}
      />
    )
  }

  return (
    <div
      onMouseEnter={() => onHoverMatchKey(matchKey)}
      onMouseLeave={() => onHoverMatchKey(null)}
      style={{
        flex: '1 1 50%',
        minWidth: 0,
        margin,
        backgroundColor: isHovered ? '#e7f6f8' : 'transparent',
        fontFamily: 'monospace',
        fontSize: '13px',
        cursor: 'default',
      }}
    >
      <span
        style={{
          color: '#0066cc',
          opacity: 0.6,
        }}
      >
        &lt;/{node.tagName}&gt;
      </span>
    </div>
  )
}

interface NodeCellProps {
  node: HtmlTreeNode | null | undefined
  isHovered: boolean
  hasVisibleDifferences: boolean
  onHoverMatchKey: (matchKey: string | null) => void
  matchKey: string
  depth: number
}

const NodeCell: React.FC<NodeCellProps> = ({
  node,
  isHovered,
  hasVisibleDifferences,
  onHoverMatchKey,
  matchKey,
  depth,
}) => {
  const margin = `2px 4px 2px ${depth * 10}px`
  if (!node) {
    return (
      <div
        style={{
          flex: '1 1 50%',
          minWidth: 0,
          margin,
          backgroundColor: '#f4e3db',
          borderLeft: '2px solid #b50909',
          fontFamily: 'monospace',
          fontSize: '13px',
        }}
      >
        <span style={{ color: '#b50909', fontStyle: 'italic' }}>(missing)</span>
      </div>
    )
  }

  if (node.type === 'text') {
    const displayText =
      node.textContent && node.textContent.length > 300
        ? node.textContent.substring(0, 300) + '...'
        : node.textContent

    return (
      <div
        onMouseEnter={() => onHoverMatchKey(matchKey)}
        onMouseLeave={() => onHoverMatchKey(null)}
        style={{
          flex: '1 1 50%',
          minWidth: 0,
          margin,
          backgroundColor: isHovered
            ? '#e7f6f8'
            : hasVisibleDifferences
              ? '#fff3cd'
              : 'transparent',
          borderLeft: hasVisibleDifferences ? '2px solid #ffbe2e' : 'none',
          fontFamily: 'monospace',
          fontSize: '13px',
          cursor: 'default',
        }}
      >
        <span
          style={{
            color: '#666',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          title={
            node.textContent !== displayText ? node.textContent : undefined
          }
        >
          &quot;{displayText}&quot;
        </span>
      </div>
    )
  }

  // Element node
  return (
    <div
      onMouseEnter={() => onHoverMatchKey(matchKey)}
      onMouseLeave={() => onHoverMatchKey(null)}
      style={{
        flex: '1 1 50%',
        minWidth: 0,
        margin,
        backgroundColor: isHovered
          ? '#e7f6f8'
          : hasVisibleDifferences
            ? '#fff3cd'
            : 'transparent',
        borderLeft: hasVisibleDifferences ? '2px solid #ffbe2e' : 'none',
        fontFamily: 'monospace',
        fontSize: '13px',
        cursor: 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: '4px',
        }}
      >
        <span style={{ color: '#0066cc', whiteSpace: 'nowrap' }}>
          &lt;{node.tagName}
        </span>
        {node.attributes &&
          Object.entries(node.attributes).map(([key, value]) => {
            const displayValue =
              value.length > 200 ? value.substring(0, 200) + '...' : value
            return (
              <span
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '2px',
                }}
              >
                <span style={{ color: '#a31545' }}>{key}</span>
                <span style={{ color: '#666' }}>=</span>
                <span
                  style={{
                    color: '#008000',
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                  }}
                  title={value !== displayValue ? value : undefined}
                >
                  &quot;{displayValue}&quot;
                </span>
              </span>
            )
          })}
        <span style={{ color: '#0066cc', whiteSpace: 'nowrap' }}>&gt;</span>
      </div>
    </div>
  )
}

interface DifferenceItemProps {
  difference: DifferenceDetail
  nodeId: string
  differenceIndex: number
  onAccept?: (nodeId: string, differenceIndex: number) => void
}

const DifferenceItem: React.FC<DifferenceItemProps> = ({
  difference,
  nodeId,
  differenceIndex,
  onAccept,
}) => {
  return (
    <div
      style={{
        marginBottom: '4px',
        padding: '4px',
        backgroundColor: '#fff',
        borderRadius: '3px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '11px' }}>
          {difference.description}
        </div>
        {difference.leftValue && (
          <div style={{ fontSize: '11px', color: '#b50909' }}>
            Left: {difference.leftValue}
          </div>
        )}
        {difference.rightValue && (
          <div style={{ fontSize: '11px', color: '#00a91c' }}>
            Right: {difference.rightValue}
          </div>
        )}
      </div>
      {onAccept && (
        <button
          type="button"
          onClick={() => onAccept(nodeId, differenceIndex)}
          style={{
            fontSize: '10px',
            padding: '2px 4px',
            backgroundColor: '#565c65',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            marginLeft: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          Accept
        </button>
      )}
    </div>
  )
}

interface CommentFormProps {
  nodeId: string
  existingComment?: string
  onAddComment?: (nodeId: string, comment: string) => void
}

const CommentForm: React.FC<CommentFormProps> = ({
  nodeId,
  existingComment,
  onAddComment,
}) => {
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
          style={{
            marginTop: '6px',
            fontSize: '11px',
            padding: '2px 6px',
            backgroundColor: '#005ea2',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {existingComment ? 'Update Comment' : 'Add Comment'}
        </button>
      )}
      {showCommentForm && (
        <div style={{ marginTop: '6px' }}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter your comment..."
            rows={2}
            style={{
              width: '100%',
              padding: '4px',
              fontSize: '11px',
              fontFamily: 'inherit',
              borderRadius: '3px',
              border: '1px solid #757575',
            }}
          />
          <div style={{ marginTop: '4px', display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={handleAddComment}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                backgroundColor: '#00a91c',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCommentForm(false)
                setCommentText('')
              }}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

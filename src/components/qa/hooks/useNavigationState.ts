/**
 * useNavigationState - Manages scroll-based navigation and difference tracking
 */

import * as React from 'react'
import { NavigableDifference } from '../TreeNodeRenderer'

interface UseNavigationStateOptions {
  navigableDifferences: NavigableDifference[]
  differenceCount: number
}

export const useNavigationState = ({
  navigableDifferences,
  differenceCount,
}: UseNavigationStateOptions) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const differenceRefsMap = React.useRef<Map<number, HTMLDivElement>>(new Map())
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const [currentDifferenceIndex, setCurrentDifferenceIndex] = React.useState(0)
  const [minVisibleDepth, setMinVisibleDepth] = React.useState(0)

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Adjust current index if it exceeds difference count
  React.useEffect(() => {
    if (differenceCount > 0 && currentDifferenceIndex >= differenceCount) {
      setCurrentDifferenceIndex(Math.max(0, differenceCount - 1))
    }
  }, [differenceCount, currentDifferenceIndex])

  // Calculate minimum visible depth for indentation adjustment
  const calculateMinVisibleDepth = React.useCallback(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerTop = containerRect.top
    const containerBottom = containerRect.bottom

    const rowElements = container.querySelectorAll('[data-row-depth]')

    let minDepth = Infinity
    let topMostElement: Element | null = null
    let topMostElementTop = Infinity

    rowElements.forEach((el) => {
      const rect = el.getBoundingClientRect()

      if (rect.bottom > containerTop && rect.top < containerBottom) {
        const depth = parseInt(
          (el as HTMLElement).getAttribute('data-row-depth') || '0',
          10
        )

        if (depth < minDepth) {
          minDepth = depth
        }

        if (rect.top < topMostElementTop) {
          topMostElementTop = rect.top
          topMostElement = el
        }
      }
    })

    if (minDepth !== Infinity && minDepth !== minVisibleDepth) {
      const topElementOffsetBefore = topMostElement
        ? topMostElement.getBoundingClientRect().top - containerTop
        : 0

      setMinVisibleDepth(minDepth)

      requestAnimationFrame(() => {
        if (topMostElement && scrollContainerRef.current) {
          const topElementOffsetAfter =
            topMostElement.getBoundingClientRect().top - containerTop
          const offsetDiff = topElementOffsetAfter - topElementOffsetBefore

          if (offsetDiff !== 0) {
            scrollContainerRef.current.scrollTop += offsetDiff
          }
        }
      })
    }
  }, [minVisibleDepth])

  // Handle scroll events
  const handleScroll = React.useCallback(() => {
    if (scrollContainerRef.current && navigableDifferences.length > 0) {
      const container = scrollContainerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerCenter = containerTop + containerRect.height / 2

      let closestIndex = 0
      let closestDistance = Infinity

      navigableDifferences.forEach((item, idx) => {
        const element = differenceRefsMap.current.get(item.matchIndex)
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

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      calculateMinVisibleDepth()
    }, 150)
  }, [calculateMinVisibleDepth, navigableDifferences, currentDifferenceIndex])

  // Navigate to a specific difference
  const goToDifference = React.useCallback(
    (index: number) => {
      if (index < 0 || index >= differenceCount) return

      const { matchIndex } = navigableDifferences[index]
      const element = differenceRefsMap.current.get(matchIndex)

      if (element && scrollContainerRef.current) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        setCurrentDifferenceIndex(index)
      }
    },
    [differenceCount, navigableDifferences]
  )

  // Navigate to next difference with smart centering
  const goToNextDifference = React.useCallback(() => {
    if (!scrollContainerRef.current || differenceCount === 0) return

    const container = scrollContainerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    const currentElement = differenceRefsMap.current.get(
      navigableDifferences[currentDifferenceIndex]?.matchIndex
    )
    if (currentElement) {
      const currentRect = currentElement.getBoundingClientRect()
      const currentCenter = currentRect.top + currentRect.height / 2
      const distanceFromCenter = Math.abs(currentCenter - containerCenter)
      const centerThreshold = containerRect.height * 0.2

      if (distanceFromCenter > centerThreshold) {
        goToDifference(currentDifferenceIndex)
        return
      }
    }

    const nextIndex = (currentDifferenceIndex + 1) % differenceCount
    goToDifference(nextIndex)
  }, [
    navigableDifferences,
    differenceCount,
    currentDifferenceIndex,
    goToDifference,
  ])

  // Navigate to previous difference with smart centering
  const goToPreviousDifference = React.useCallback(() => {
    if (!scrollContainerRef.current || differenceCount === 0) return

    const container = scrollContainerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2

    const currentElement = differenceRefsMap.current.get(
      navigableDifferences[currentDifferenceIndex]?.matchIndex
    )
    if (currentElement) {
      const currentRect = currentElement.getBoundingClientRect()
      const currentCenter = currentRect.top + currentRect.height / 2
      const distanceFromCenter = Math.abs(currentCenter - containerCenter)
      const centerThreshold = containerRect.height * 0.2

      if (distanceFromCenter > centerThreshold) {
        goToDifference(currentDifferenceIndex)
        return
      }
    }

    const prevIndex =
      (currentDifferenceIndex - 1 + differenceCount) % differenceCount
    goToDifference(prevIndex)
  }, [
    navigableDifferences,
    differenceCount,
    currentDifferenceIndex,
    goToDifference,
  ])

  // Register difference element refs for navigation
  const registerDifferenceRef = React.useCallback(
    (matchIndex: number) => (el: HTMLDivElement | null) => {
      if (el) {
        differenceRefsMap.current.set(matchIndex, el)
      }
    },
    []
  )

  return {
    scrollContainerRef,
    currentDifferenceIndex,
    minVisibleDepth,
    handleScroll,
    goToNextDifference,
    goToPreviousDifference,
    registerDifferenceRef,
  }
}

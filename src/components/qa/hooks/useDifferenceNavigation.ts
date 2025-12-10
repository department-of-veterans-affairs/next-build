/**
 * useDifferenceNavigation - Hook for navigating between HTML differences
 *
 * Queries elements with [data-html-difference] attribute and provides:
 * - Current difference index (0-based)
 * - Total count of differences
 * - goToNext/goToPrev functions for navigation with wrapping
 *
 * The data-html-difference attribute is the single source of truth for
 * what counts as a navigable difference.
 */

import { useState, useEffect, useCallback, RefObject } from 'react'

interface UseDifferenceNavigationResult {
  currentIndex: number // 0-based
  totalCount: number
  goToNext: () => void
  goToPrev: () => void
}

export function useDifferenceNavigation(
  scrollContainerRef: RefObject<HTMLElement | null>
): UseDifferenceNavigationResult {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  // Track container availability to trigger effect re-runs
  const [container, setContainer] = useState<HTMLElement | null>(null)

  // Sync container state with ref (runs every render to catch ref changes)
  useEffect(() => {
    if (scrollContainerRef.current !== container) {
      setContainer(scrollContainerRef.current)
    }
  }, [scrollContainerRef, container])

  // Query all elements with data-html-difference attribute
  const getDifferenceElements = useCallback((): Element[] => {
    if (!container) return []
    return Array.from(container.querySelectorAll('[data-html-difference]'))
  }, [container])

  // Find which difference element's center is closest to the container's center
  const findClosestIndex = useCallback((): number => {
    if (!container) return 0

    const elements = getDifferenceElements()
    if (elements.length === 0) return 0

    const containerRect = container.getBoundingClientRect()
    const containerCenterY = containerRect.top + containerRect.height / 2

    let closestIndex = 0
    let minDistance = Infinity

    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect()
      const elCenterY = rect.top + rect.height / 2
      const distance = Math.abs(elCenterY - containerCenterY)

      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })

    return closestIndex
  }, [container, getDifferenceElements])

  // Smooth scroll to center a specific element in the container
  const scrollToElement = useCallback(
    (element: Element) => {
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      // Calculate offset needed to center the element
      const elementCenterY = elementRect.top + elementRect.height / 2
      const containerCenterY = containerRect.top + containerRect.height / 2
      const offset = elementCenterY - containerCenterY

      container.scrollBy({
        top: offset,
        behavior: 'smooth',
      })
    },
    [container]
  )

  // Update count and current index helper
  const updateState = useCallback(() => {
    const elements = getDifferenceElements()
    setTotalCount(elements.length)
    if (elements.length > 0) {
      setCurrentIndex(findClosestIndex())
    } else {
      setCurrentIndex(0)
    }
  }, [getDifferenceElements, findClosestIndex])

  // Recalculate on scroll (100ms debounce)
  useEffect(() => {
    if (!container) return

    let timeoutId: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateState, 100)
    }

    // Initial calculation (deferred to avoid synchronous setState in effect)
    timeoutId = setTimeout(updateState, 0)

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [container, updateState])

  // Also update when DOM changes (data-html-difference added/removed)
  useEffect(() => {
    if (!container) return

    let timeoutId: ReturnType<typeof setTimeout>

    const observer = new MutationObserver(() => {
      // Debounce mutation updates to avoid excessive re-renders
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateState, 50)
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-html-difference'],
    })

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [container, updateState])

  // Navigate to next difference (wraps around)
  const goToNext = useCallback(() => {
    const elements = getDifferenceElements()
    if (elements.length === 0) return

    const nextIndex = (currentIndex + 1) % elements.length
    scrollToElement(elements[nextIndex])
    setCurrentIndex(nextIndex)
  }, [currentIndex, getDifferenceElements, scrollToElement])

  // Navigate to previous difference (wraps around)
  const goToPrev = useCallback(() => {
    const elements = getDifferenceElements()
    if (elements.length === 0) return

    const prevIndex = (currentIndex - 1 + elements.length) % elements.length
    scrollToElement(elements[prevIndex])
    setCurrentIndex(prevIndex)
  }, [currentIndex, getDifferenceElements, scrollToElement])

  return {
    currentIndex,
    totalCount,
    goToNext,
    goToPrev,
  }
}

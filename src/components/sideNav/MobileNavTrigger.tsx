'use client'

import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'

interface MobileNavTriggerProps {
  onToggle: () => void
  sidebarId?: string
}

export function MobileNavTrigger({
  onToggle,
  sidebarId = 'va-detailpage-sidebar',
}: MobileNavTriggerProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [triggerHeight, setTriggerHeight] = useState(0)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for sticky positioning
  useEffect(() => {
    const sentinel = sentinelRef.current
    const trigger = triggerRef.current
    if (!sentinel || !trigger) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not intersecting (scrolled past), make trigger sticky
        const shouldBeSticky = !entry.isIntersecting
        setIsSticky(shouldBeSticky)

        // Measure and store the trigger height when it becomes sticky
        if (shouldBeSticky && triggerHeight === 0) {
          setTriggerHeight(trigger.offsetHeight)
        }
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [triggerHeight])

  return (
    <>
      {/* Sentinel element for IntersectionObserver */}
      <div ref={sentinelRef} className="sidenav-trigger-sentinel" />

      {/* Placeholder to prevent layout shift when trigger becomes fixed */}
      {isSticky && (
        <div
          className="sidenav-trigger-placeholder"
          style={{ height: `${triggerHeight}px` }}
        />
      )}

      {/* Mobile sidebar trigger */}
      <div
        ref={triggerRef}
        className={clsx('va-btn-sidebarnav-trigger', {
          'sidenav-trigger--sticky': isSticky,
        })}
        id="sidenav-trigger"
      >
        <button aria-controls={sidebarId} onClick={onToggle}>
          <strong>In this section</strong>
          <va-icon
            icon="menu"
            size="3"
            className="vads-u-color--link-default"
          />
        </button>
      </div>
    </>
  )
}

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SideNavMenu, SideNavItem } from '@/types/formatted/sideNav'
import { SideNavMenuIcon } from './formatted-type'
import { recordEvent } from '@/lib/analytics/recordEvent'
import clsx from 'clsx'
import { pathsMatch, pathContains, findCurrentPathDepth } from './path-utils'

interface CustomSideNavProps {
  menu: SideNavMenu
  icon?: SideNavMenuIcon | null
}

export function CustomSideNav({ menu, icon }: CustomSideNavProps) {
  const currentPath = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [triggerHeight, setTriggerHeight] = useState(0)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Toggle sidebar handler
  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  // Close sidebar handler
  const handleClose = () => {
    setIsOpen(false)
  }

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const handleNavClick = () => {
    recordEvent({ event: 'nav-sidenav' })
  }

  if (!menu.data.links || menu.data.links.length === 0) {
    return null
  }

  const firstLink = menu.data.links[0]
  const { depth, links: deepLinks } = findCurrentPathDepth(
    firstLink.links || [],
    currentPath
  )

  const renderSubSubList = (items: SideNavItem[]) => (
    <ul className="usa-sidenav-sub_list">
      {items.map((item, idx) => (
        <li key={idx}>
          <a
            className={
              pathsMatch(currentPath, item.url.path) ? 'usa-current' : ''
            }
            href={item.url.path}
            onClick={handleNavClick}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )

  const renderSubList = (items: SideNavItem[]) => (
    <ul className="usa-sidenav-sub_list">
      {items.map((item, idx) => {
        const hasSubItems = item.links && item.links.length > 0
        const isActivePath = pathContains(currentPath, item.url.path)

        return (
          <li key={idx} className={isActivePath ? 'active-level' : ''}>
            <a
              className={
                pathsMatch(currentPath, item.url.path) ? 'usa-current' : ''
              }
              href={item.url.path}
              onClick={handleNavClick}
            >
              {item.label}
            </a>
            {hasSubItems && renderSubSubList(item.links)}
          </li>
        )
      })}
    </ul>
  )

  const renderAccordionContent = (items: SideNavItem[]) => (
    <ul className="usa-sidenav-list">
      {items.map((item, idx) => {
        const hasSubItems = item.links && item.links.length > 0
        const isActivePath =
          item.url.path && pathContains(currentPath, item.url.path)

        return (
          <li key={idx} className={isActivePath ? 'active-level' : ''}>
            <a
              className={
                pathsMatch(currentPath, item.url.path) ? 'usa-current' : ''
              }
              href={item.url.path}
              onClick={handleNavClick}
            >
              {item.label}
            </a>
            {hasSubItems && renderSubList(item.links)}
          </li>
        )
      })}
    </ul>
  )

  const renderShallowNav = () => (
    <nav aria-label="Secondary">
      <ul className="usa-accordion">
        {firstLink.links?.map((link, idx) => {
          const isFirstAndNoDeepLinks = idx === 0 && !deepLinks

          return (
            <li key={idx}>
              <button
                className="usa-accordion-button"
                aria-expanded={isFirstAndNoDeepLinks ? 'true' : 'false'}
                aria-controls={`a${idx + 1}`}
              >
                {link.label}
              </button>
              <div
                id={`a${idx + 1}`}
                className="usa-accordion-content"
                aria-hidden="false"
              >
                {link.links &&
                  link.links.length > 0 &&
                  renderAccordionContent(link.links)}
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  const renderDeepNav = () => {
    if (!deepLinks) return null

    return (
      <>
        <div className="sidenav-previous-page">
          <a href={deepLinks.url.path}>{deepLinks.label}</a>
        </div>
        <ul className="usa-sidenav-list">
          {deepLinks.links?.map((link, idx) => {
            const hasSubItems = link.links && link.links.length > 0
            const isActivePath = pathsMatch(currentPath, link.url.path)

            return (
              <li key={idx} className={isActivePath ? 'active-level' : ''}>
                <a
                  className={isActivePath ? 'usa-current' : ''}
                  href={link.url.path}
                  onClick={handleNavClick}
                >
                  {link.label}
                </a>
                {hasSubItems && (
                  <ul className="usa-sidenav-sub_list">
                    {link.links.map((subLink, subIdx) => (
                      <li key={subIdx}>
                        <a
                          className={
                            pathsMatch(currentPath, subLink.url.path)
                              ? 'usa-current'
                              : ''
                          }
                          href={subLink.url.path}
                          onClick={handleNavClick}
                        >
                          {subLink.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  return (
    <>
      <nav
        data-template="navigation/sidebar_nav"
        aria-label="Secondary"
        id="va-detailpage-sidebar"
        data-drupal-sidebar="true"
        className={clsx(
          'va-drupal-sidebarnav va-sidebarnav vads-grid-col-3 vads-u-margin-bottom--2',
          { 'va-sidebarnav--opened': isOpen }
        )}
      >
        <div aria-modal="true" role="dialog" aria-labelledby="sidebar_header">
          <button
            className="va-sidenav-btn-close va-sidebarnav-close"
            type="button"
            aria-label="Close this menu"
            onClick={handleClose}
          >
            <va-icon
              icon="close"
              size="3"
              className="vads-u-color--gray-dark"
            />
          </button>

          <div className="vads-u-display--flex vads-u-align-items--center left-side-nav-title">
            {icon && (
              <va-icon
                icon={icon.name}
                size="3"
                className={clsx(
                  'hub-icon vads-u-color--white vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-margin-right--1',
                  `vads-u-background-color--${icon.backgroundColor}`
                )}
              />
            )}
            <h4 id="sidebar_header">{firstLink.label}</h4>
          </div>

          {depth <= 2 ? renderShallowNav() : renderDeepNav()}
        </div>
      </nav>

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
        <button aria-controls="va-detailpage-sidebar" onClick={handleToggle}>
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

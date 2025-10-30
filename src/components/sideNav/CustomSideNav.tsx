'use client'

import React, { useEffect, useState } from 'react'
import { SideNavMenu, SideNavItem } from '@/types/formatted/sideNav'
import { SideNavMenuIcon } from './formatted-type'
import { getHubIcon } from '@/lib/utils/benefitsHub'
import { recordEvent } from '@/lib/analytics/recordEvent'
import clsx from 'clsx'

interface CustomSideNavProps {
  menu: SideNavMenu
  icon?: SideNavMenuIcon | null
}

interface DeepLinksResult {
  depth: number
  links: SideNavItem | null
}

// Helper function to normalize paths by removing trailing slashes
function normalizePath(path: string): string {
  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
}

// Helper function to check if paths match (ignoring trailing slashes)
function pathsMatch(path1: string, path2: string): boolean {
  return normalizePath(path1) === normalizePath(path2)
}

// Helper function to check if one path contains another (ignoring trailing slashes)
function pathContains(fullPath: string, partialPath: string): boolean {
  return normalizePath(fullPath).includes(normalizePath(partialPath))
}

// Helper function to find current path depth and deep links
function findCurrentPathDepth(
  links: SideNavItem[],
  currentPath: string,
  depth = 0
): DeepLinksResult {
  for (const link of links) {
    if (pathsMatch(link.url.path, currentPath)) {
      return { depth, links: link }
    }

    if (link.links && link.links.length > 0) {
      // Check if current path is contained in any child paths
      const hasChild = link.links.some(
        (child) =>
          pathsMatch(child.url.path, currentPath) ||
          pathContains(currentPath, child.url.path)
      )

      if (hasChild) {
        const result = findCurrentPathDepth(link.links, currentPath, depth + 1)
        if (result.links) {
          return { depth: result.depth, links: link }
        }
      }
    }
  }

  return { depth: 0, links: null }
}

export function CustomSideNav({ menu, icon }: CustomSideNavProps) {
  const [currentPath, setCurrentPath] = useState<string>('')

  useEffect(() => {
    // Set current path on client side
    setCurrentPath(window.location.pathname)
  }, [])

  // Close sidebar handler
  const handleClose = () => {
    const sidebar = document.getElementById('va-detailpage-sidebar')
    if (sidebar) {
      sidebar.style.display = 'none'
    }
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
    <nav
      data-template="navigation/sidebar_nav"
      aria-label="Secondary"
      id="va-detailpage-sidebar"
      data-drupal-sidebar="true"
      className="va-drupal-sidebarnav va-sidebarnav vads-grid-col-3"
    >
      <div aria-modal="true" role="dialog" aria-labelledby="sidebar_header">
        <button
          className="va-sidenav-btn-close va-sidebarnav-close"
          type="button"
          aria-label="Close this menu"
          onClick={handleClose}
        >
          <va-icon icon="close" size="3" className="vads-u-color--gray-dark" />
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
  )
}

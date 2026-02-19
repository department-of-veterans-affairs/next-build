import { BreadcrumbItem } from '@/types/drupal/field_type'
import { Breadcrumb } from './formatted-types'

function getRelativePathFromURL(uri) {
  return new URL(uri, 'http://va.gov').pathname
}

export function formatBreadcrumbs(breadcrumbs: BreadcrumbItem[]): Breadcrumb[] {
  return breadcrumbs.map((crumb) => ({
    href: getRelativePathFromURL(crumb.uri),
    label: crumb.title,
    options: crumb.options,
  }))
}

/**
 * Normalizes a path for comparison by ensuring it has a leading slash
 * and removing trailing slashes (except for root path).
 */
function normalizePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return normalized.endsWith('/') && normalized !== '/'
    ? normalized.slice(0, -1)
    : normalized
}

/**
 * Normalizes breadcrumbs by:
 * 1. Setting href to "" for all breadcrumbs that match the current path
 * 2. Filtering out all breadcrumbs with href: "" except the last one
 *
 * @param breadcrumbs - Array of formatted breadcrumbs
 * @param currentPath - The current page path to match against
 * @returns A normalized array of breadcrumbs
 */
export function normalizeBreadcrumbs(
  breadcrumbs: Breadcrumb[],
  currentPath: string
): Breadcrumb[] {
  if (breadcrumbs.length === 0) {
    return []
  }

  const normalizedCurrentPath = normalizePath(currentPath)

  // Step 1: Change all breadcrumbs matching current path to href: ""
  const withEmptyHrefs = breadcrumbs.map((crumb) => {
    const normalizedHref = normalizePath(crumb.href)
    if (normalizedHref === normalizedCurrentPath) {
      return {
        ...crumb,
        href: '',
      }
    }
    return crumb
  })

  // Step 2: Filter out all breadcrumbs with href: "" except the last one
  return withEmptyHrefs.filter((crumb, index, arr) => {
    // Keep the last breadcrumb even if href is ""
    if (index === arr.length - 1) {
      return true
    }
    // Filter out all other breadcrumbs with empty href
    return crumb.href !== ''
  })
}

/**
 * Replaces the title of the last breadcrumb if it has an empty href,
 * otherwise appends a new breadcrumb with empty href and the provided title.
 *
 * @param breadcrumbs - Array of normalized breadcrumbs
 * @param title - The title to use for the last breadcrumb
 * @returns A new array of breadcrumbs with the last breadcrumb updated or added
 */
export function replaceLastBreadcrumbWithTitle(
  breadcrumbs: Breadcrumb[],
  title: string
): Breadcrumb[] {
  if (breadcrumbs.length === 0) {
    // If no breadcrumbs exist, add one with empty href and page title
    return [
      {
        href: '',
        label: title,
        options: [],
      },
    ]
  }

  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]

  // If last breadcrumb has empty href, replace its title
  if (lastBreadcrumb.href === '') {
    return [
      ...breadcrumbs.slice(0, -1),
      {
        ...lastBreadcrumb,
        label: title,
      },
    ]
  }

  // Otherwise, append a new breadcrumb with empty href
  return [
    ...breadcrumbs,
    {
      href: '',
      label: title,
      options: [],
    },
  ]
}

import { BreadcrumbItem, BreadCrumbLink } from '@/types/drupal/field_type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export function deriveLastBreadcrumbFromPath(
  breadcrumbs: BreadcrumbItem[],
  breadcrumbTitle: string,
  currentPath: string,
  replaceLastItem: boolean
): BreadcrumbItem[] {
  const last: BreadcrumbItem = {
    uri: currentPath,
    title: breadcrumbTitle,
    options: [],
  }

  if (replaceLastItem) {
    breadcrumbs.splice(breadcrumbs.length - 1, 1, last)
  } else {
    breadcrumbs.push(last)
  }

  return breadcrumbs
}

// Intended for handling breadcrumbs for learning center content types
export function deriveLcBreadcrumbs(
  breadcrumbs: BreadcrumbItem[],
  breadcrumbTitle: string,
  currentPath: string,
  lcBreadcrumbsTitleInclude?: boolean
): BreadcrumbItem[] {
  const filteredCrumbs: BreadcrumbItem[] = breadcrumbs.filter(
    (crumb) => crumb.uri !== '/resources'
  )

  filteredCrumbs.push({
    uri: currentPath,
    title: 'Resources and support',
    options: [],
  })

  if (lcBreadcrumbsTitleInclude) {
    filteredCrumbs.push({
      uri: currentPath,
      title: breadcrumbTitle,
      options: [],
    })
  }

  return filteredCrumbs
}

function getRelativePathFromURL(uri) {
  return new URL(uri, 'http://va.gov').pathname
}

export function transformBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
  return breadcrumbs.map((crumb) => ({
    href: getRelativePathFromURL(crumb.uri),
    label: crumb.title,
    options: crumb.options,
  }))
}

// Filters out breadcrumbs with no relavant href, excluding the last which would represent the current page
export function filterInvalidCrumbs(
  crumbs: BreadCrumbLink[]
): BreadCrumbLink[] {
  return crumbs.filter((crumb, index, arr) => {
    return crumb.href !== '' || index === arr.length - 1
  })
}

export const shouldHideHomeBreadcrumb = (resourceType) => {
  const typesToShowHomeBreadcrumb = [
    RESOURCE_TYPES.EVENT,
    RESOURCE_TYPES.EVENT_LISTING,
    RESOURCE_TYPES.VET_CENTER,
  ]

  return !typesToShowHomeBreadcrumb.includes(resourceType)
}

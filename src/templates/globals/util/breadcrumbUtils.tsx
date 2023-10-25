import { BreadcrumbItem } from '@/types/dataTypes/drupal/field_type'

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
  titleInclude?: boolean
): BreadcrumbItem[] {
  const filteredCrumbs: BreadcrumbItem[] = breadcrumbs.filter(
    (crumb) => crumb.uri !== '/resources'
  )

  filteredCrumbs.push({
    uri: currentPath,
    title: 'Resources and support',
    options: [],
  })

  if (titleInclude) {
    filteredCrumbs.push({
      uri: currentPath,
      title: breadcrumbTitle,
      options: [],
    })
  }

  return filteredCrumbs
}

export function transformBreadcrumbs(breadcrumbs) {
  const transformedCrumbs = breadcrumbs.map((crumb) => ({
    href: crumb.uri,
    label: crumb.title,
    options: crumb.options,
  }))

  return transformedCrumbs
}

export function filterInvalidCrumbs(crumbs) {
  return crumbs.filter((crumb, index, arr) => {
    return crumb.href !== 'internal:#' || index === arr.length - 1
  })
}

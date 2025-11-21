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

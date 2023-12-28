import {
  transformBreadcrumbs,
  deriveLastBreadcrumbFromPath,
  deriveLcBreadcrumbs,
  filterInvalidCrumbs,
} from '@/lib/utils/breadcrumbs'
import { BreadcrumbItem, BreadCrumbLink } from '@/types/drupal/field_type'

interface BreadcrumbProps {
  breadcrumbs?: BreadcrumbItem[]
  breadcrumbTitle?: string
  disableAnalytics?: boolean
  deriveBreadcrumbsFromUrl?: boolean
  replaceLastItem?: boolean
  constructLcBreadcrumbs?: boolean
  lcBreadcrumbsTitleInclude?: boolean
  hideHomeBreadcrumb?: boolean
  customCrumbHomeText?: string
  entityPath?: string
}
const Breadcrumbs = ({
  breadcrumbs,
  entityPath,
  breadcrumbTitle,
  disableAnalytics,
  deriveBreadcrumbsFromUrl,
  replaceLastItem,
  constructLcBreadcrumbs,
  lcBreadcrumbsTitleInclude,
  hideHomeBreadcrumb,
  customCrumbHomeText,
}: BreadcrumbProps) => {
  if (!breadcrumbs) return null

  if (customCrumbHomeText) {
    breadcrumbs = breadcrumbs.map((crumb) => {
      if (crumb.title === 'Home') {
        return { ...crumb, title: customCrumbHomeText }
      }
      return crumb
    })
  } else if (hideHomeBreadcrumb) {
    breadcrumbs = breadcrumbs.filter((crumb) => crumb.title !== 'Home')
  }

  if (deriveBreadcrumbsFromUrl) {
    breadcrumbs = deriveLastBreadcrumbFromPath(
      breadcrumbs,
      breadcrumbTitle,
      entityPath,
      replaceLastItem
    )
  }

  if (constructLcBreadcrumbs) {
    breadcrumbs = deriveLcBreadcrumbs(
      breadcrumbs,
      breadcrumbTitle,
      entityPath,
      lcBreadcrumbsTitleInclude
    )
  }

  const breadcrumbList: BreadCrumbLink[] = transformBreadcrumbs(breadcrumbs)
  const filteredCrumbs: BreadCrumbLink[] = filterInvalidCrumbs(breadcrumbList)

  return (
    <va-breadcrumbs
      disable-analytics={disableAnalytics}
      class="hydrated va-nav-breadcrumbs"
      wrapping={false}
    >
      {filteredCrumbs.map((crumb, index) => {
        return (
          <a key={index} href={crumb.href}>
            {crumb.label}
          </a>
        )
      })}
    </va-breadcrumbs>
  )
}

export default Breadcrumbs

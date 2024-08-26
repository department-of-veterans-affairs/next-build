import {
  transformBreadcrumbs,
  deriveLastBreadcrumbFromPath,
  deriveRcBreadcrumbs,
  filterInvalidCrumbs,
} from '@/lib/utils/breadcrumbs'
import { BreadcrumbItem, BreadCrumbLink } from '@/types/drupal/field_type'

interface BreadcrumbProps {
  breadcrumbs?: BreadcrumbItem[]
  breadcrumbTitle?: string
  disableAnalytics?: boolean
  deriveBreadcrumbsFromUrl?: boolean
  replaceLastItem?: boolean
  constructRcBreadcrumbs?: boolean
  RcBreadcrumbsTitleInclude?: boolean
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
  constructRcBreadcrumbs,
  RcBreadcrumbsTitleInclude,
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

  if (constructRcBreadcrumbs) {
    breadcrumbs = deriveRcBreadcrumbs(
      breadcrumbs,
      breadcrumbTitle,
      entityPath,
      RcBreadcrumbsTitleInclude
    )
  }

  const breadcrumbList: BreadCrumbLink[] = transformBreadcrumbs(breadcrumbs)
  const filteredCrumbs: BreadCrumbLink[] = filterInvalidCrumbs(breadcrumbList)
  const fcString = JSON.stringify(filteredCrumbs)

  return (
    <div className="vads-u-padding-x--1p5">
      <va-breadcrumbs
        id="va-breadcrumbs-list"
        class="row hydrated"
        uswds={true}
        wrapping
        breadcrumb-list={fcString}
        disableAnalytics={disableAnalytics}
      />
    </div>
  )
}

export default Breadcrumbs

import {
  transformBreadcrumbs,
  deriveLastBreadcrumbFromPath,
  deriveRcBreadcrumbs,
  filterInvalidCrumbs,
} from '@/lib/utils/breadcrumbs'
import { BreadcrumbItem, BreadCrumbLink } from '@/types/drupal/field_type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedPageResource } from '@/lib/drupal/queries'

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
  resource?: StaticPropsResource<FormattedPageResource>
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
  resource,
}: BreadcrumbProps) => {
  if (!breadcrumbs) return null

  if (!hideHomeBreadcrumb) {
    if (customCrumbHomeText) {
      breadcrumbs = breadcrumbs.map((crumb) => {
        if (crumb.title === 'Home') {
          return { ...crumb, title: customCrumbHomeText }
        }
        return crumb
      })
    }
    //breadcrumbs = breadcrumbs.filter((crumb) => crumb.title !== 'Home')
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

  // Handle BenefitsHub breadcrumbs automatically if resource is provided
  if (resource && resource.type === RESOURCE_TYPES.BENEFITS_HUB) {
    breadcrumbs = deriveLastBreadcrumbFromPath(
      breadcrumbs,
      resource.title,
      entityPath,
      true
    )
  }

  const breadcrumbList: BreadCrumbLink[] = transformBreadcrumbs(breadcrumbs)
  const filteredCrumbs: BreadCrumbLink[] = filterInvalidCrumbs(breadcrumbList)
  const fcString = JSON.stringify(filteredCrumbs)

  return (
    <div className="vads-grid-container">
      <va-breadcrumbs class="row" wrapping breadcrumb-list={fcString} />
    </div>
  )
}

export default Breadcrumbs

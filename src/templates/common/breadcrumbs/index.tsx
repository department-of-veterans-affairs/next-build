import {
  transformBreadcrumbs,
  deriveLastBreadcrumbFromPath,
  deriveLcBreadcrumbs,
  filterInvalidCrumbs,
} from '@/templates/globals/util/breadcrumbUtils'
import { BreadcrumbItem } from '@/types/dataTypes/drupal/field_type'

interface BreadcrumbProps {
  breadcrumbs?: BreadcrumbItem[]
  breadcrumbTitle?: string
  disableAnalytics?: boolean
  deriveBreadcrumbsFromUrl?: boolean
  replaceLastItem?: boolean
  constructLcBreadcrumbs?: boolean
  titleInclude?: boolean
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
  titleInclude,
  hideHomeBreadcrumb,
  customCrumbHomeText,
}: BreadcrumbProps) => {
  if (!breadcrumbs) return null

  if (hideHomeBreadcrumb) {
    if (customCrumbHomeText) {
      breadcrumbs = breadcrumbs.map((crumb) => {
        if (crumb.title === 'Home') {
          return { ...crumb, title: customCrumbHomeText }
        }
        return crumb
      })
    } else {
      breadcrumbs = breadcrumbs.filter((crumb) => crumb.title !== 'Home')
    }
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
      titleInclude
    )
  }

  const breadcrumbList = transformBreadcrumbs(breadcrumbs)
  const filteredCrumbs = filterInvalidCrumbs(breadcrumbList)

  return (
    <div>
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
    </div>
  )
}

Breadcrumbs.defaultProps = {
  label: 'Breadcrumbs',
  uswds: true,
  string: '',
}

export default Breadcrumbs

import {
  transformBreadcrumbs,
  deriveLastBreadcrumbFromPath,
  deriveLcBreadcrumbs,
  filterInvalidCrumbs,
} from '@/templates/globals/util/breadcrumbUtils'
import { BreadcrumbItem } from '@/types/index'

interface BreadcrumbProps {
  breadcrumbs?: BreadcrumbItem[]
  breadcrumbsOverride?: BreadcrumbItem[]
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
  breadcrumbsOverride,
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
  const breadcrumbData: BreadcrumbItem[] = breadcrumbs
  let crumbs = breadcrumbsOverride || breadcrumbData

  if (!crumbs) return null

  if (hideHomeBreadcrumb) {
    if (customCrumbHomeText) {
      crumbs = crumbs.map((crumb) => {
        if (crumb.title === 'Home') {
          return { ...crumb, title: customCrumbHomeText }
        }
        return crumb
      })
    } else {
      crumbs = crumbs.filter((crumb) => crumb.title !== 'Home')
    }
  }

  if (deriveBreadcrumbsFromUrl) {
    crumbs = deriveLastBreadcrumbFromPath(
      breadcrumbData,
      breadcrumbTitle,
      entityPath,
      replaceLastItem
    )
  }

  if (constructLcBreadcrumbs) {
    crumbs = deriveLcBreadcrumbs(
      breadcrumbData,
      breadcrumbTitle,
      entityPath,
      titleInclude
    )
  }

  const breadcrumbList = transformBreadcrumbs(crumbs)
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

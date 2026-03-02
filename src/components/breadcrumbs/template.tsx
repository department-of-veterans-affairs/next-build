import { Breadcrumb } from './formatted-types'

interface BreadcrumbProps {
  breadcrumbs?: Breadcrumb[]
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbProps) => {
  if (!breadcrumbs) return null

  return (
    <div className="vads-grid-container" style={{ minHeight: '5.125rem' }}>
      <va-breadcrumbs
        class="vads-grid-row"
        wrapping
        breadcrumb-list={JSON.stringify(breadcrumbs)}
      ></va-breadcrumbs>
    </div>
  )
}

export default Breadcrumbs

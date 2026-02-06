import { Breadcrumb } from './formatted-types'

interface BreadcrumbProps {
  breadcrumbs?: Breadcrumb[]
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbProps) => {
  if (!breadcrumbs) return null

  return (
    <div className="vads-grid-container" style={{ minHeight: '5.125rem' }}>
      {/* I want the va-breadcrumbs to still trigger a lazy load of the custom element */}
      <div style={{ display: 'none' }}>
        <va-breadcrumbs
          class="row"
          wrapping
          breadcrumb-list={[]}
        ></va-breadcrumbs>
      </div>
      <div className="row">
        <nav aria-label="Breadcrumb" className="usa-breadcrumb usa-breadcrumb--wrap"><ol role="list" className="usa-breadcrumb__list"><li className="usa-breadcrumb__list-item"><a className="usa-breadcrumb__link" href="/" lang="en-US" hrefLang="en-US"><span>VA.gov home</span></a></li><li className="usa-breadcrumb__list-item"><a className="usa-breadcrumb__link" href="/education" lang="en-US" hrefLang="en-US"><span>Education and training</span></a></li><li className="usa-breadcrumb__list-item"><a className="usa-breadcrumb__link" href="/education/benefit-rates" lang="en-US" hrefLang="en-US"><span>Education benefit rates</span></a></li><li className="usa-breadcrumb__list-item"><a className="usa-breadcrumb__link" href="/education/benefit-rates/post-9-11-gi-bill-rates" lang="en-US" hrefLang="en-US"><span>Post-9/11 GI Bill (Chapter 33) rates</span></a></li><li className="usa-breadcrumb__list-item usa-current" aria-current="page"><a className="usa-breadcrumb__link" href="#content" lang="en-US" hrefLang="en-US"><span>Past rates: 2021-22 Post-9/11 GI Bill</span></a></li></ol></nav>
      </div>
    </div>
  )
}

export default Breadcrumbs

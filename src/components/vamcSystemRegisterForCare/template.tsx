import React from 'react'
import { VamcSystemRegisterForCare as FormattedVamcSystemRegisterForCare } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'

export const VamcSystemRegisterForCare = ({
  title,
  vamcSystem,
}: FormattedVamcSystemRegisterForCare) => {
  return (
    <div
      className="interior"
      id="content"
      data-template="vamc_system_register_for_care"
    >
      <main className="va-l-detail-page va-facility-page">
        <div className="usa-grid usa-grid-full">
          {/* TODO: Facility sidebar navigation */}
          <div className="usa-width-three-fourths">
            <article
              aria-labelledby="article-heading"
              role="region"
              className="usa-content"
            >
              {/* TODO: Lovell switch link */}
              <div>TODO: Lovell switch link</div>

              <h1 id="article-heading">{title}</h1>
              <div className="va-introtext">
                <p>
                  Register to get care at one of our {vamcSystem?.title}{' '}
                  facilities. Not yet enrolled in VA health care? We can help
                  you apply in person or get started online.
                </p>
              </div>

              {/* TODO: On this page navigation */}
              <div>TODO: On this page navigation</div>

              {/* TODO: Centralized content - top of page */}
              <div className="usa-content">
                <div>TODO: Centralized content - top of page</div>
              </div>

              {/* TODO: Facilities offering non-clinical service */}
              <div>TODO: Facilities offering non-clinical service</div>

              {/* TODO: Centralized content - bottom of page */}
              <div>TODO: Centralized content - bottom of page</div>

              {/* TODO: Related links */}
              <div className="va-nav-linkslist va-nav-linkslist--related">
                <div>TODO: Related links</div>
              </div>

              <va-back-to-top></va-back-to-top>

              <ContentFooter />
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VamcSystemRegisterForCare

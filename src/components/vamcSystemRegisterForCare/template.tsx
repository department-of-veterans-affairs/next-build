import { Fragment, useEffect } from 'react'
import { VamcSystemRegisterForCare as FormattedVamcSystemRegisterForCare } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/template'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/template'
import {
  ServiceLocation,
  ServiceLocationType,
} from '../serviceLocation/template'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export const VamcSystemRegisterForCare = ({
  title,
  vamcSystem,
  lastUpdated,
  menu,
  topOfPageContent,
  bottomOfPageContent,
  relatedLinks,
  services,
}: FormattedVamcSystemRegisterForCare) => {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div
      className="interior"
      id="content"
      data-template="vamc_system_register_for_care"
    >
      <main className="va-l-detail-page va-facility-page">
        <div className="usa-grid usa-grid-full">
          {/* Nav data filled in by a separate script from `window.sideNav` */}
          <nav aria-label="secondary" data-widget-type="side-nav" />
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

              <va-on-this-page></va-on-this-page>

              <div className="usa-content">
                <Wysiwyg {...topOfPageContent} />
              </div>

              {services.map((service) => (
                <Fragment key={service.id}>
                  <h3>
                    <va-link href={service.path} text={service.title}></va-link>
                  </h3>
                  {service.serviceLocations.map((serviceLocation) => (
                    <ServiceLocation
                      key={serviceLocation.id}
                      location={serviceLocation}
                      locationType={ServiceLocationType.NON_CLINICAL}
                      headingLevel={4}
                    />
                  ))}
                </Fragment>
              ))}

              <Wysiwyg {...bottomOfPageContent} />

              {/* TODO: Related links */}
              <div className="va-nav-linkslist va-nav-linkslist--related">
                <ListOfLinkTeasers {...relatedLinks} />
              </div>

              <va-back-to-top></va-back-to-top>

              <ContentFooter lastUpdated={lastUpdated} />
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VamcSystemRegisterForCare

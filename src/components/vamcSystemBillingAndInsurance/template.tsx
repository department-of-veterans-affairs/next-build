import { Fragment, useEffect } from 'react'
import { VamcSystemBillingAndInsurance as FormattedVamcSystemBillingAndInsurance } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/template'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/template'
import {
  ServiceLocation,
  ServiceLocationType,
} from '../serviceLocation/template'
import { Address } from '@/components/address/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export const VamcSystemBillingAndInsurance = ({
  title,
  vamcSystem,
  lastUpdated,
  menu,
  aboveTopOfPageContent,
  topOfPageContent,
  bottomOfPageContent,
  relatedLinks,
  services,
  lovellVariant,
  lovellSwitchPath,
}: FormattedVamcSystemBillingAndInsurance) => {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div
      className="vads-grid-container"
      data-template="vamc_system_billing_insurance"
    >
      {/* Nav data filled in by a separate script from `window.sideNav` */}
      <nav aria-label="secondary" data-widget-type="side-nav" />
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">
          <article
            aria-labelledby="article-heading"
            role="region"
            className="usa-content"
          >
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />

            <h1 id="article-heading">{title}</h1>
            <div className="va-introtext">
              <p>
                You can pay your {vamcSystem.title} bill online, by phone, mail,
                or in person.
              </p>
            </div>

            <va-on-this-page></va-on-this-page>

            <div className="usa-content">
              {aboveTopOfPageContent ? (
                <Wysiwyg {...aboveTopOfPageContent} />
              ) : (
                <>
                  <h2>Questions about copay balance</h2>
                  <p>
                    For questions about the copay balance of your{' '}
                    {vamcSystem?.title} bill, call us toll free at the number
                    below. You won&apos;t need to pay any copays for X-rays, lab
                    tests, preventative tests, and services like health
                    screenings or immunizations.
                  </p>
                </>
              )}
            </div>

            <div className="usa-content">
              <Wysiwyg {...topOfPageContent} />
            </div>

            {services.map((service) => (
              <Fragment key={service.id}>
                <h3>
                  <va-link href={service.path} text={service.title}></va-link>
                </h3>
                {service.address && (
                  <Address address={service.address} showDirections={false} />
                )}
                {service.serviceLocations.map((serviceLocation) => (
                  <ServiceLocation
                    key={serviceLocation.id}
                    location={serviceLocation}
                    locationType={ServiceLocationType.NON_CLINICAL}
                    mainPhoneString={service.phoneNumber}
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
    </div>
  )
}

export default VamcSystemBillingAndInsurance

import { Fragment, useEffect } from 'react'
import { VamcSystemMedicalRecordsOffice as FormattedVamcSystemMedicalRecordsOffice } from './formatted-type'
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

export const VamcSystemMedicalRecordsOffice = ({
  title,
  vamcSystem,
  lastUpdated,
  menu,
  topOfPageContent,
  getRecordsInPersonContent,
  bottomOfPageContent,
  relatedLinks,
  services,
  lovellVariant,
  lovellSwitchPath,
}: FormattedVamcSystemMedicalRecordsOffice) => {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div
      className="vads-grid-container"
      data-template="vamc_system_medical_records_office"
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
                Get copies of your VA medical records online, by mail or fax, or
                in person at our {vamcSystem?.title} Release of Information
                office.
              </p>
            </div>

            <va-on-this-page></va-on-this-page>

            <div className="usa-content">
              <Wysiwyg {...topOfPageContent} />
            </div>

            <div className="usa-content">
              <Wysiwyg {...getRecordsInPersonContent} />
            </div>

            {services.length > 0 && (
              <>
                <h3>Release of Information office locations</h3>
                {services.map((service) => (
                  <Fragment key={service.id}>
                    <h4>
                      <va-link
                        href={service.path}
                        text={service.title}
                      ></va-link>
                    </h4>
                    {service.address && (
                      <Address
                        address={service.address}
                        showDirections={false}
                      />
                    )}
                    {service.serviceLocations.map((serviceLocation) => (
                      <ServiceLocation
                        key={serviceLocation.id}
                        location={serviceLocation}
                        locationType={ServiceLocationType.NON_CLINICAL}
                        mainPhoneString={service.phoneNumber}
                        headingLevel={5}
                      />
                    ))}
                  </Fragment>
                ))}
              </>
            )}

            {/* TODO: Add centralized content sections from medical records template
              - fieldCcGetRecordsMailOrFax
              - fieldCcHowWeShareRecords
              - fieldCcFaqs
            */}

            {/* TODO: Add individual node fields from medical records template
              - fieldVamcMedRecordsMailing (mailing address)
              - fieldFaxNumber (fax number)
            */}

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

export default VamcSystemMedicalRecordsOffice

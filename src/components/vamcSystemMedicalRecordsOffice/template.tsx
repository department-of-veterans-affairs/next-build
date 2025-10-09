import { Fragment } from 'react'
import { VamcSystemMedicalRecordsOffice as FormattedVamcSystemMedicalRecordsOffice } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { Wysiwyg } from '@/components/wysiwyg/template'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import {
  ServiceLocation,
  ServiceLocationType,
} from '@/components/serviceLocation/template'
import { Address } from '@/components/address/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { ReactWidget } from '@/components/reactWidget/template'
import { QaSection } from '../qaSection/template'

export const VamcSystemMedicalRecordsOffice = ({
  title,
  vamcSystem,
  lastUpdated,
  menu,
  topOfPageContent,
  getRecordsInPersonContent,
  howWeShareRecordsContent,
  faqsContent,
  reactWidget,
  relatedLinks,
  services,
  lovellVariant,
  lovellSwitchPath,
}: FormattedVamcSystemMedicalRecordsOffice) => {
  return (
    <SideNavLayout
      menu={menu}
      data-template="vamc_system_medical_records_office"
    >
      <article className="usa-content">
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />

        <h1 id="article-heading">{title}</h1>
        <div className="va-introtext">
          <p>
            Get copies of your VA medical records online, by mail or fax, or in
            person at our {vamcSystem?.title} Release of Information office.
          </p>
        </div>

        <va-on-this-page></va-on-this-page>

        <div className="usa-content">
          <Wysiwyg {...topOfPageContent} />
        </div>

        <ReactWidget {...reactWidget} />

        <div className="usa-content">
          <Wysiwyg {...getRecordsInPersonContent} />
        </div>

        {services.length > 0 && (
          <>
            <h3>Release of Information office locations</h3>
            {services.map((service) => (
              <Fragment key={service.id}>
                <h4>
                  <va-link href={service.path} text={service.title}></va-link>
                </h4>
                {service.address && (
                  <Address address={service.address} showDirections={false} />
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

        <Wysiwyg {...howWeShareRecordsContent} />

        <QaSection {...faqsContent} />

        {/* TODO: Add centralized content sections from medical records template
              - fieldCcGetRecordsMailOrFax
            */}

        {/* TODO: Add individual node fields from medical records template
              - fieldVamcMedRecordsMailing (mailing address)
              - fieldFaxNumber (fax number)
            */}

        <div className="va-nav-linkslist va-nav-linkslist--related">
          <ListOfLinkTeasers {...relatedLinks} />
        </div>

        <va-back-to-top></va-back-to-top>

        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}

export default VamcSystemMedicalRecordsOffice

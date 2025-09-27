import { Fragment } from 'react'
import { VamcSystemBillingAndInsurance as FormattedVamcSystemBillingAndInsurance } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'
import { Wysiwyg } from '../wysiwyg/template'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/template'
import {
  ServiceLocation,
  ServiceLocationType,
} from '../serviceLocation/template'
import { Address } from '@/components/address/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { Hours } from '../hours/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

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
  officeHours,
  phoneNumber,
  lovellVariant,
  lovellSwitchPath,
}: FormattedVamcSystemBillingAndInsurance) => {
  return (
    <SideNavLayout menu={menu} data-template="vamc_system_billing_insurance">
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
            You can pay your {vamcSystem.title} bill online, by phone, mail, or
            in person.
          </p>
        </div>

        <va-on-this-page></va-on-this-page>

        <div className="usa-content" data-testid="copay-section">
          {aboveTopOfPageContent ? (
            <Wysiwyg {...aboveTopOfPageContent} />
          ) : (
            <>
              <h2>Questions about copay balance</h2>
              <p>
                For questions about the copay balance of your{' '}
                {vamcSystem?.title} bill, call us toll free at the number below.
                You won&apos;t need to pay any copays for X-rays, lab tests,
                preventative tests, and services like health screenings or
                immunizations.
              </p>
            </>
          )}
          <PhoneNumber
            {...phoneNumber}
            treatment="h3"
            className="vads-u-margin-bottom--2"
          />
          <Hours allHours={officeHours} headerType="standard" />
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
    </SideNavLayout>
  )
}

export default VamcSystemBillingAndInsurance

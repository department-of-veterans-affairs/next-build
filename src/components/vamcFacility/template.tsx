import { VamcFacility as FormattedVamcFacility } from './formatted-type'

import { FacilityTopTasks } from '@/components/topTasks/template'

import { LocationServices } from './LocationServices'
import { HealthServices } from './HealthServices'
import { OperatingStatusFlags } from './OperatingStatus'
import { Address } from '@/components/address/template'
import { Phone } from './Phone'
import { Hours } from '@/components/hours/template'
import { RelatedLinks } from '@/components/relatedLinks/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { MediaImage } from '@/components/mediaImage/template'
import { TextWithImage } from '@/components/textWithImage/template'
import { VamcSystemSocialLinks } from '@/components/vamcSystemSocialLinks/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { SchemaScript } from './SchemaScript'

export function VamcFacility(props: FormattedVamcFacility) {
  const {
    title,
    introText,
    lastUpdated,
    operatingStatusFacility,
    menu,
    path,
    administration,
    vamcSystemTitle,
    vamcEhrSystem,
    officeHours,
    address,
    mainPhoneString,
    vaHealthConnectPhoneNumber,
    image,
    facilityLocatorApiId,
    mentalHealthPhoneNumber: fieldTelephone,
    relatedLinks,
    locationServices,
    socialLinks,
    lovellVariant,
    lovellSwitchPath,
    healthServices,
  } = props

  // Used to get a base url path of a health care region from `path`
  // NOTE: Maybe could use entity.field_region_page.path.alias instead?
  // `content-build` does it this way, though.
  const regionBasePath = path.split('/')[1]

  return (
    <SideNavLayout menu={menu}>
      <article className="usa-content va-l-facility-detail">
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />

        {title && <h1>{title}</h1>}

        {introText && (
          <div className="va-introtext">
            <p>{introText}</p>
          </div>
        )}

        <FacilityTopTasks
          path={regionBasePath}
          administration={administration}
          vamcEhrSystem={vamcEhrSystem}
        />

        <va-on-this-page></va-on-this-page>

        {/* Main content */}
        <h2
          id="location-and-contact-information"
          className="vads-u-margin-bottom--3"
        >
          Location and contact information
        </h2>
        <TextWithImage
          image={
            <>
              <MediaImage {...image} imageStyle="3_2_medium_thumbnail" />
              <div
                data-widget-type="facility-map"
                data-facility={facilityLocatorApiId}
              />
            </>
          }
        >
          <div>
            <OperatingStatusFlags
              operatingStatusFacility={operatingStatusFacility}
              basePath={menu.data.links[0].url.path}
            />
            <section>
              <SchemaScript {...props} />

              <h3
                className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                id="address-heading"
              >
                Address
              </h3>
              <div className="vads-u-margin-bottom--3">
                <Address address={address} title={title} />
              </div>

              <h3
                className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                id="phone-numbers"
              >
                Phone numbers
              </h3>
              <Phone
                mainPhoneString={mainPhoneString}
                vaHealthConnectPhoneNumber={vaHealthConnectPhoneNumber}
                mentalHealthPhoneNumber={fieldTelephone}
              />
              <div data-testid="facility-hours">
                <Hours allHours={officeHours} headerType="clinical" />
              </div>
            </section>
          </div>
        </TextWithImage>
        <LocationServices items={locationServices} />
        <RelatedLinks
          {...relatedLinks}
          title={`Other services at ${vamcSystemTitle}`}
        />
        <HealthServices
          healthServices={healthServices}
          mentalHealthPhoneNumber={fieldTelephone}
          mainPhoneString={mainPhoneString}
        />
        {facilityLocatorApiId.includes('vha_') && (
          <div
            data-testid="patient-satisfaction-widget"
            data-widget-type="facility-patient-satisfaction-scores"
            data-facility={`"vha_${facilityLocatorApiId.split('_')[1].toUpperCase()}"`}
          />
        )}
        <VamcSystemSocialLinks {...socialLinks} />
        <va-back-to-top></va-back-to-top>
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}

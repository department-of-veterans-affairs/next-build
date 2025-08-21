import { useEffect } from 'react'
import { ContentFooter } from '@/templates/common/contentFooter'
import { VbaFacility as FormattedVBAFacility } from '@/products/vbaFacility/formatted-type'
import { Wysiwyg } from '@/templates/components/wysiwyg'
import { ExpandableOperatingStatus } from '@/templates/components/expandableOperatingStatus'
import { Address } from '@/products/healthCareLocalFacility/Address'
import { PhoneNumber } from '@/templates/common/phoneNumber'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { Hours } from '@/templates/components/hours'
import { PrepareForVisitAccordions } from '@/templates/components/prepareForVisitAccordions'
import { MediaImage } from '@/templates/common/mediaImage'
import { TextWithImage } from '@/templates/components/textWithImage'
import { GetUpdatesSection } from '@/templates/components/getUpdatesSection'
import { VbaFacilityServiceGroup } from './vbaFacilityServiceGroup'

type facilityApiAddress = {
  addressLine1: string
  addressLine2?: string | null
  administrativeArea: string
  countryCode: string
  locality: string
  postalCode: string
}
interface customWindow extends Window {
  mainVBAPhone?: string
  mainVBAAddress?: facilityApiAddress
  mainVBAFacilityApiId?: string
}
declare const window: customWindow

export function VbaFacility({
  title,
  lastUpdated,
  ccBenefitsHotline,
  ccCantFindBenefits,
  ccGetUpdates,
  ccVBAFacilityOverview,
  featuredContent,
  facilityLocatorApiId,
  image,
  officeHours,
  operatingStatusFacility,
  operatingStatusMoreInfo,
  prepareForVisit,
  phoneNumber,
  address,
  allServices,
}: FormattedVBAFacility) {
  useEffect(() => {
    window.mainVBAPhone = phoneNumber
    window.mainVBAAddress = {
      addressLine1: address.address_line1,
      addressLine2: address.address_line2 || null,
      administrativeArea: address.administrative_area,
      countryCode: address.country_code,
      locality: address.locality,
      postalCode: address.postal_code,
    }
    window.mainVBAFacilityApiId = facilityLocatorApiId
  }, [phoneNumber, address, facilityLocatorApiId])
  // Alpha sort all services
  allServices.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
  // Split up by service categories
  const veteranBenefitsServices = allServices.filter(
    (service) => service.type === 'vba_veteran_benefits'
  )
  const familyMemberCaregiverBenefits = allServices.filter(
    (service) => service.type === 'vba_family_member_caregiver_benefits'
  )
  const serviceMemberBenefits = allServices.filter(
    (service) => service.type === 'vba_service_member_benefits'
  )
  const otherServices = allServices.filter(
    (service) => service.type === 'vba_other_services'
  )
  return (
    <div className="interior">
      <main className="va-l-detail-page va-facility-page">
        <div className="vads-grid-container">
          <article className="usa-content va-l-facility-detail">
            <h1>{title}</h1>
            {ccVBAFacilityOverview && (
              <div className="va-introtext">
                <Wysiwyg {...ccVBAFacilityOverview} />
              </div>
            )}
            <div className="vads-u-margin-top--1p5 vads-u-margin-bottom--3">
              <va-link-action
                class="vads-u-display--block"
                href="https://va.my.site.com/VAVERA/s/"
                text="Make an appointment"
                type="secondary"
                data-testid="make-appointment-link"
              />
              <va-link-action
                class="vads-u-display--block"
                href="https://ask.va.gov"
                text="Ask a benefit question"
                type="secondary"
                data-testid="ask-benefit-question-link"
              />
              <va-link-action
                class="vads-u-display--block"
                href="/claim-or-appeal-status"
                text="Check a claim status"
                type="secondary"
                data-testid="check-claim-status-link"
              />
            </div>
            <va-on-this-page></va-on-this-page>

            <h2
              id="location-and-contact-informati"
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
              <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                Address
              </h3>

              <ExpandableOperatingStatus
                operatingStatusFlag={operatingStatusFacility}
                operatingStatusMoreInfo={operatingStatusMoreInfo}
              />

              <div className="vads-u-margin--0 vads-u-margin-bottom--3">
                <Address address={address} title={title} />
              </div>

              <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                Phone numbers
              </h3>
              <PhoneNumber
                className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                label="Main phone"
                number={phoneNumber}
              />
              <PhoneNumber
                className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                {...ccBenefitsHotline}
              />
              <Hours headerType="office" allHours={officeHours} />
            </TextWithImage>

            {/* Prepare for Your Visit */}
            {prepareForVisit && prepareForVisit.length > 0 && (
              <PrepareForVisitAccordions
                visitItems={prepareForVisit}
                topMargin
                accordionId="vba-regional-facilities-accordion-prepare-for-visit"
              />
            )}
            {/* In the spotlight */}
            <h2 id="in-the-spotlight" className="vads-u-margin-bottom--3">
              In the spotlight
            </h2>
            <div
              id="field-vet-center-feature-content"
              className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between tablet:vads-u-flex-direction--row vads-u-margin-bottom--4"
            >
              {featuredContent &&
                featuredContent.map((content, index) => (
                  <FeaturedContent
                    key={index}
                    title={content.title}
                    description={content.description}
                    link={content.link}
                    id={content.id || ''}
                  />
                ))}
            </div>
            {veteranBenefitsServices && veteranBenefitsServices.length > 0 && (
              <VbaFacilityServiceGroup
                heading={'Veteran benefits'}
                headingId="veteran-benefits"
                services={veteranBenefitsServices}
                mainPhone={phoneNumber}
              />
            )}
            {familyMemberCaregiverBenefits &&
              familyMemberCaregiverBenefits.length > 0 && (
                <VbaFacilityServiceGroup
                  heading={'Family member and caregiver benefits'}
                  headingId="family-member-and-caregiver-be"
                  services={familyMemberCaregiverBenefits}
                  mainPhone={phoneNumber}
                />
              )}
            {serviceMemberBenefits && serviceMemberBenefits.length > 0 && (
              <VbaFacilityServiceGroup
                heading={'Service member benefits'}
                headingId="service-member-benefits"
                services={serviceMemberBenefits}
                mainPhone={phoneNumber}
              />
            )}
            {otherServices && otherServices.length > 0 && (
              <VbaFacilityServiceGroup
                heading={'Other services'}
                headingId="other-services"
                services={otherServices}
                mainPhone={phoneNumber}
              />
            )}
            {ccCantFindBenefits && (
              <va-alert
                status="info"
                visible
                data-testid="cant-find-benefits-alert"
              >
                <h2 id="cant-find-benefits-headline" slot="headline">
                  {ccCantFindBenefits.header}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: ccCantFindBenefits.description,
                  }}
                ></div>
                {ccCantFindBenefits.link.url &&
                  ccCantFindBenefits.link.label && (
                    <va-link
                      href={ccCantFindBenefits.link.url}
                      text={ccCantFindBenefits.link.label}
                    />
                  )}
              </va-alert>
            )}
            {ccGetUpdates && (
              <GetUpdatesSection
                heading={ccGetUpdates.heading}
                links={ccGetUpdates.links}
                sectionId="get-updates-from-the-veteran-b"
              />
            )}
            <h2
              id="other-nearby-va-locations"
              className="vads-u-margin-bottom--3"
            >
              Other nearby VA locations
            </h2>
            <div data-widget-type="va-location-nearby"></div>

            <h2
              id="va-locations-in-other-areas"
              className="vads-u-margin-bottom--3"
            >
              VA locations in other areas
            </h2>
            <p>Looking for a VA benefits location in another area?</p>
            <p>
              <va-link
                href="/find-locations?facilityType=benefits"
                text="Find a VA benefits location"
              ></va-link>
            </p>
            <va-back-to-top></va-back-to-top>
            <ContentFooter lastUpdated={lastUpdated} />
          </article>
        </div>
      </main>
    </div>
  )
}

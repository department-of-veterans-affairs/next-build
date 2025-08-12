import { VetCenter as FormattedVetCenter } from '@/types/formatted/vetCenter'
import { Hours } from '@/templates/components/hours'
import { MediaImage } from '@/templates/common/mediaImage'
import { AlertBlock } from '@/templates/components/alertBlock'
import VetCenterHealthServices from '@/templates/components/vetCenterHealthServices'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { QaSection } from '@/templates/components/qaSection'
import { ExpandableOperatingStatus } from '@/templates/components/expandableOperatingStatus'
import { PhoneNumber } from '@/templates/common/phoneNumber'
import { SchemaScript } from './SchemaScript'
import { Address } from '@/templates/layouts/healthCareLocalFacility/Address'
import { ContentFooter } from '@/templates/common/contentFooter'
import { PrepareForVisitAccordions } from '@/templates/components/prepareForVisitAccordions'
import { TextWithImage } from '@/templates/components/textWithImage'

export function VetCenter(vetCenterProps: FormattedVetCenter) {
  const {
    address,
    ccNonTraditionalHours,
    ccVetCenterCallCenter,
    ccVetCenterFaqs,
    featuredContent,
    introText,
    missionExplainer,
    officeHours,
    officialName,
    operatingStatusFacility,
    operatingStatusMoreInfo,
    phoneNumber,
    counselingHealthServices,
    referralHealthServices,
    otherHealthServices,
    image,
    bannerImage,
    prepareForVisit,
    title,
    fieldFacilityLocatorApiId,
    path,
  } = vetCenterProps

  const directionsString = [
    address?.address_line1,
    address?.locality,
    address?.administrative_area,
  ]

  const alsoCalled =
    officialName && title !== officialName
      ? `Also called the ${officialName}`
      : null
  const alsoCalledId = 'vet-center-title'

  return (
    <div className="vads-grid-container">
      <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
        {title && (
          <>
            <h1 aria-describedby={alsoCalled ? alsoCalledId : undefined}>
              {title}
            </h1>
            {alsoCalled && (
              <p
                id={alsoCalledId}
                className="vads-u-font-family--serif vads-u-font-size--lg vads-u-font-weight--bold"
              >
                {alsoCalled}
              </p>
            )}
          </>
        )}
        {bannerImage && (
          <MediaImage
            {...bannerImage}
            imageStyle="7_2_medium_thumbnail"
            className="vads-u-padding-y--1p5"
          />
        )}
        {introText && (
          <div className="va-introtext">
            <p>{introText}</p>
          </div>
        )}
        {missionExplainer && (
          <va-summary-box
            class="vads-u-margin-bottom--4 desktop:vads-u-margin-bottom--0"
            data-header-id-excluded="true"
          >
            <h2 slot="headline">{missionExplainer.heading}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: missionExplainer.body,
              }}
            />
          </va-summary-box>
        )}
        <va-on-this-page></va-on-this-page>

        {/* Locations and contact */}
        <h2 id="locations-and-contact-information">
          Location and contact information
        </h2>
        <TextWithImage
          image={
            <>
              <MediaImage {...image} imageStyle="3_2_medium_thumbnail" />
              <div
                data-widget-type="facility-map"
                data-facility={fieldFacilityLocatorApiId}
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
            Phone number
          </h3>
          <PhoneNumber
            className="vads-u-margin-top--0 vads-u-margin-bottom--3"
            label="Main phone"
            number={phoneNumber}
          />

          <Hours
            headerType="standard"
            allHours={officeHours}
            nonTraditionalMessage={ccNonTraditionalHours}
          />
        </TextWithImage>

        {/* Call Center Information */}
        {ccVetCenterCallCenter && (
          <div className="vads-u-margin-bottom--2">
            <AlertBlock
              alertType="info"
              id="field-cc-vet-call-center"
              title="Need help after hours?"
              content={ccVetCenterCallCenter}
            />
          </div>
        )}

        {/* Other locations */}
        <div className="vads-u-margin-bottom--3">
          <h2 id="other-locations">Other locations</h2>
          <p>
            Vet Centers are community based to be more accessible in areas where
            you live.
          </p>
          <p>
            <va-link
              active
              href={`${path}/locations`}
              text={`View more ${title} locations`}
            ></va-link>
          </p>
        </div>

        {/* Prepare for Your Visit */}
        {prepareForVisit && prepareForVisit.length > 0 && (
          <PrepareForVisitAccordions visitItems={prepareForVisit} />
        )}

        {/* Featured Content */}
        <h2
          id="in-the-spot-light"
          className="vads-u-margin-top--0 vads-u-font-size--lg
          mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
        >
          In the spotlight
        </h2>
        <div
          id="field-vet-center-feature-content"
          className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between tablet:vads-u-flex-direction--row vads-u-margin-bottom--4 "
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

        {/* Health Services */}
        <VetCenterHealthServices
          services={counselingHealthServices}
          typeOfCare={'counseling'}
        />
        <VetCenterHealthServices
          services={referralHealthServices}
          typeOfCare={'referral'}
        />
        <VetCenterHealthServices
          services={otherHealthServices}
          typeOfCare={'other'}
        />

        {/* FAQs */}
        {ccVetCenterFaqs && <QaSection {...ccVetCenterFaqs} />}

        <va-back-to-top></va-back-to-top>

        <ContentFooter />

        <SchemaScript vetCenter={vetCenterProps} />
      </article>
    </div>
  )
}

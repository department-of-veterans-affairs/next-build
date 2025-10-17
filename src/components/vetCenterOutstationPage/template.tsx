import { VetCenterOutstationPage as FormattedVetCenterOutstationPage } from './formatted-type'
import { Hours } from '@/components/hours/template'
import { MediaImage } from '@/components/mediaImage/template'
import { AlertBlock } from '@/components/alertBlock/template'
import VetCenterHealthServices from '@/components/vetCenterHealthServices/template'
import { FeaturedContent } from '@/components/featuredContent/template'
import { QaSection } from '@/components/qaSection/template'
import { ExpandableOperatingStatus } from '@/components/expandableOperatingStatus/template'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { SchemaScript } from '@/components/vetCenter/SchemaScript'
import { Address } from '@/components/address/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { PrepareForVisitAccordions } from '@/components/prepareForVisitAccordions/template'
import { TextWithImage } from '@/components/textWithImage/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

export function VetCenterOutstationPage(
  outStationProps: FormattedVetCenterOutstationPage
) {
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
    parentVetCenter,
  } = outStationProps

  const alsoCalled =
    officialName && title !== officialName
      ? `Also called the ${officialName}`
      : null
  const alsoCalledId = 'vet-center-outstation-title'

  // Create side navigation with only "Locations" link
  const sideNavMenu = {
    rootPath: `${parentVetCenter.path}/`,
    data: {
      name: 'Locations',
      description: 'Vet Center locations',
      links: [
        {
          description: 'View all locations for this Vet Center',
          expanded: false,
          label: 'Locations',
          links: [],
          url: { path: `${parentVetCenter.path}/locations` },
          lovellSection: null,
        },
      ],
    },
  }

  return (
    <SideNavLayout menu={sideNavMenu}>
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

        {/* Location and contact information */}
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
              href={`${parentVetCenter.path}/locations`}
              text={`View more ${parentVetCenter.title} locations`}
            ></va-link>
          </p>
        </div>

        <va-back-to-top></va-back-to-top>

        <ContentFooter />

        <SchemaScript vetCenter={outStationProps} />
      </article>
    </SideNavLayout>
  )
}

import { VetCenterOutstation as FormattedVetCenterOutstation } from './formatted-type'
import { GoogleMapsDirections } from '@/components/googleMapsDirections/template'
import { Hours } from '@/components/hours/template'
import { FeaturedContent } from '@/components/featuredContent/template'
import { QaSection } from '@/components/qaSection/template'
import { Accordion } from '@/components/accordion/template'
import { AccordionItem } from '@/components/accordion/formatted-type'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { TextWithImage } from '@/components/textWithImage/template'
import { MediaImage } from '@/components/mediaImage/template'
import { SchemaScript } from './SchemaScript'

const PrepareForVisitComponent = ({
  visitItems,
}: {
  visitItems: AccordionItem[]
}) => {
  if (visitItems.length === 0) return null
  return (
    <>
      <h2
        id="prepare-for-your-visit"
        className="vads-u-margin-top--0 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
      >
        Prepare for your visit
      </h2>
      <p>Select a topic to learn more.</p>
      <div className="vads-u-margin-bottom--3">
        <Accordion id={'prepare-for-your-visit'} bordered items={visitItems} />
      </div>
    </>
  )
}

export function VetCenterOutstation(
  vetCenterOutstationProps: FormattedVetCenterOutstation
) {
  const {
    address,
    ccNonTraditionalHours,
    ccVetCenterCallCenter,
    ccVetCenterFaqs,
    featuredContent,
    introText,
    officeHours,
    officialName,
    phoneNumber,
    image,
    prepareForVisit,
    title,
    fieldFacilityLocatorApiId,
    path,
  } = vetCenterOutstationProps

  return (
    <div className="vads-grid-container">
      <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
        {title && (
          <>
            <h1 aria-describedby="vet-center-title">{title}</h1>
            {officialName && title !== officialName && (
              <p
                id="vet-center-title"
                className="vads-u-line-height--4 vads-u-font-family--serif vads-u-font-size--lg vads-u-font-weight--bold vads-u-padding-bottom--0p5"
              >
                Also called the {officialName}
              </p>
            )}
          </>
        )}
        {introText && (
          <div className="va-introtext">
            <p>{introText}</p>
          </div>
        )}
        <va-on-this-page />

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
                data-facility={fieldFacilityLocatorApiId}
              />
            </>
          }
        >
          {/* TODO: put operating status here */}
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
            Address
          </h3>
          <div className="vads-u-margin-bottom--3">
            <address>
              <div>{address.address_line1}</div>
              {address.address_line2 && <div>{address.address_line2}</div>}
              <div>{`${address.locality}, ${address.administrative_area} ${address.postal_code}`}</div>
            </address>
            <GoogleMapsDirections address={address} location={title} />
          </div>

          <div className="vads-u-margin-bottom--3">
            <PhoneNumber
              number={phoneNumber}
              label="Main phone"
              className="main-phone vads-u-margin-bottom--1"
            />
            {ccVetCenterCallCenter && (
              <>
                <PhoneNumber
                  number={phoneNumber}
                  label="After hours"
                  className="main-phone vads-u-margin-bottom--1"
                />
                <div className="vads-u-margin-bottom--2">
                  Need help after hours? We are available 24/7. Call us anytime.
                </div>
              </>
            )}
          </div>

          <Hours
            headerType="standard"
            allHours={officeHours}
            nonTraditionalMessage={ccNonTraditionalHours}
          />
        </TextWithImage>

        <h2 id="in-the-spotlight" className="vads-u-margin-y--2">
          In the spotlight
        </h2>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4 ">
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

        {/* Prepare for Your Visit */}
        {prepareForVisit && prepareForVisit.length > 0 && (
          <PrepareForVisitComponent visitItems={prepareForVisit} />
        )}

        {/* FAQs */}
        {ccVetCenterFaqs && <QaSection {...ccVetCenterFaqs} />}

        {/* Other locations */}
        <div className="vads-u-margin-bottom--3">
          <h2
            id="other-nearby-vet-centers"
            className="vads-u-font-size--lg vads-u-line-height--1 vads-u-margin-bottom--1"
          >
            Other nearby Vet Centers
          </h2>
          <div>
            <p className="vads-u-margin-bottom--0 vads-u-line-height--4">
              Vet Centers are community based to be more accessible in areas
              where you live. Find a nearby Vet Center location.
            </p>
            <va-link
              href={`${path}/locations`}
              text="Find a nearby Vet Center location"
            />
          </div>
        </div>

        <va-back-to-top></va-back-to-top>

        <SchemaScript vetCenterOutstation={vetCenterOutstationProps} />
      </article>
    </div>
  )
}

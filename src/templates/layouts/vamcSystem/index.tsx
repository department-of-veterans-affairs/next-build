import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
import { ImageAndStaticMap } from '@/templates/components/imageAndStaticMap'
import { AlertBlock } from '@/templates/components/alertBlock'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { QaSection } from '@/templates/components/qaSection'
import { Accordion } from '@/templates/components/accordion'

export function VamcSystem({
  title,
  fieldDescription,
  fieldIntroText,
  fieldMedia,
  fieldAdministration,
  fieldVaHealthConnectPhone,
  fieldVamcEhrSystem,
  fieldVamcSystemOfficialName,
  fieldFacebook,
  fieldTwitter,
  fieldInstagram,
  fieldFlickr,
  fieldYoutube,
  fieldAppointmentsOnline,
  fieldClinicalHealthServices,
  fieldRelatedLinks,
  path,
}: FormattedVamcSystem) {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths">
        <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
          {title && <h1>{title}</h1>}

          {fieldMedia && (
            <div className="duotone darken lighten medium-screen:vads-u-margin-bottom--0p5">
              <img
                src={fieldMedia.links?.['2_1_large']?.href}
                aria-hidden="true"
                role="presentation"
                alt=""
                width="100%"
              />
            </div>
          )}

          <div className="usa-grid usa-grid-full vads-u-margin-top--0 vads-u-margin-bottom--3">
            {/* TODO: Add main buttons component */}
          </div>

          {fieldIntroText && (
            <div className="va-introtext">
              <p className="vads-u-margin-bottom--0">{fieldIntroText}</p>
            </div>
          )}

          {/* Locations Section */}
          <section>
            <h2 className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 medium-screen:vads-u-margin-bottom--2p5">
              Locations
            </h2>
            {/* TODO: Add facility listing component */}
            <va-link
              active
              className="vads-u-font-size--md vads-u-display--block vads-u-width--full"
              href={`${path}/locations`}
              text="See all locations"
            />
          </section>

          {/* Manage your health online section */}
          {fieldAdministration?.entityId !== '1039' && (
            <section>
              <h2>
                {fieldAdministration?.entityId === '1040'
                  ? 'Manage your VA health online'
                  : 'Manage your health online'}
              </h2>
              <div className="vads-u-display--flex medium-screen:vads-u-flex-direction--row vads-u-flex-direction--column">
                <div className="vads-u-margin-right--0 medium-screen:vads-u-margin-right--3">
                  {/* TODO: Add health online links component */}
                </div>
              </div>
            </section>
          )}

          {/* Related Links Section */}
          {fieldRelatedLinks && (
            <div className="vads-u-margin-top--5">
              {/* TODO: Add list of link teasers component */}
            </div>
          )}

          {/* Stories Section */}
          {/* TODO: Add stories section */}

          {/* Events Section */}
          {/* TODO: Add events section */}

          {/* Social Links */}
          {/* TODO: Add social links component */}

          <va-back-to-top />
        </article>
      </div>
    </div>
  )
}

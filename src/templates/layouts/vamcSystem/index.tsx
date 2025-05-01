import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
// import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { MediaImage } from '@/templates/common/mediaImage'
// import { FacilityListing } from '@/templates/components/facilityListing'
// import { MainButtons } from '@/templates/components/mainButtons'
// import { ListOfLinkTeasers } from '@/templates/components/listOfLinkTeasers'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
// import { EventTeaser } from '@/templates/components/eventTeaser'
import { SocialLinks } from '@/templates/common/socialLinks'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'

export function VamcSystem({
  title,
  introText,
  image,
  fieldAdministration,
  // fieldVaHealthConnectPhone,
  // fieldVamcEhrSystem,
  fieldRelatedLinks,
  path,
  // mainFacilities,
  // newsStoryTeasersFeatured,
  // eventTeasersFeatured,
  // eventTeasersAll,
  // lovellVariant,
  // lovellSwitchPath,
}: LovellStaticPropsResource<FormattedVamcSystem>) {
  // TODO: It looks like the reason the image is taller than in the original page is
  // because the image file is actually different. It has a taller intrinsic height.
  // Here is an example from `/washington-dc-health-care/`:
  // Old:
  // https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/7_2_medium_thumbnail/public/2021-08/Washington%20VA%20Medical%20Center.jpg
  // New:
  // https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/2_1_large/public/2021-08/Washington%20VA%20Medical%20Center.jpg
  const hasValidImage = image?.links?.['2_1_large']?.href
  console.log('image', image)
  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
            {/* <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            /> */}

            {title && <h1>{title}</h1>}

            {hasValidImage && (
              <div className="duotone darken lighten medium-screen:vads-u-margin-bottom--0p5">
                <MediaImage
                  {...image}
                  imageStyle="2_1_large"
                />
              </div>
            )}

            <div className="usa-grid usa-grid-full vads-u-margin-top--0 vads-u-margin-bottom--3">
              {/* <MainButtons path={path} /> */}
            </div>

            {introText && (
              <div className="va-introtext">
                <p className="vads-u-margin-bottom--0">{introText}</p>
              </div>
            )}

            {/* Locations Section */}
            <section>
              <h2 className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 medium-screen:vads-u-margin-bottom--2p5">
                Locations
              </h2>
              {/* {mainFacilities?.entities?.map((facility) => (
                <FacilityListing
                  key={facility.entityId}
                  {...facility}
                  fieldVaHealthConnectPhone={fieldVaHealthConnectPhone}
                />
              ))} */}
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
                {/* <ListOfLinkTeasers
                  {...fieldRelatedLinks}
                  regionNickname={title}
                /> */}
              </div>
            )}

            {/* Stories Section */}
            {/* {newsStoryTeasersFeatured?.entities?.[0]?.reverseFieldListingNode?.entities?.length > 0 && (
              <section>
                <h2 className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-top--5">
                  Stories
                </h2>
                {newsStoryTeasersFeatured.entities[0].reverseFieldListingNode.entities
                  .slice(0, 2)
                  .map((story) => (
                    <NewsStoryTeaser key={story.entityId} {...story} />
                  ))}
                <va-link
                  active
                  className="vads-u-font-size--md vads-u-display--block vads-u-width--full"
                  href={`${path}/stories`}
                  text="See all stories"
                />
              </section>
            )} */}

            {/* Events Section */}
            {/* {(eventTeasersFeatured?.entities?.[0]?.reverseFieldListingNode?.entities?.length > 0 ||
              eventTeasersAll?.entities?.[0]?.reverseFieldListingNode?.entities?.length > 0) && (
              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--2p5">
                  Events
                </h2>
                {eventTeasersFeatured?.entities?.[0]?.reverseFieldListingNode?.entities?.map(
                  (event) => (
                    <EventTeaser key={event.entityId} {...event} />
                  )
                )}
                {!eventTeasersFeatured?.entities?.[0]?.reverseFieldListingNode?.entities?.length &&
                  eventTeasersAll?.entities?.[0]?.reverseFieldListingNode?.entities
                    ?.slice(0, 1)
                    .map((event) => (
                      <EventTeaser key={event.entityId} {...event} />
                    ))}
                <va-link
                  active
                  className="vads-u-font-size--md vads-u-display--block vads-u-width--full"
                  href={`${path}/events`}
                  text="See all events"
                />
              </section>
            )} */}

            {/* Social Links */}
            {/* <SocialLinks regionNickname={title} /> */}

            <va-back-to-top />
          </article>
          <ContentFooter />
        </div>
      </div>
    </div>
  )
}

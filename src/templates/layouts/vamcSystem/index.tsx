import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
import { MediaImage } from '@/templates/common/mediaImage'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
// import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
// import { TopTasks } from '@/templates/components/topTasks'
// import { FacilityListing } from '@/templates/components/facilityListing'
// import { MainButtons } from '@/templates/components/mainButtons'
// import { ListOfLinkTeasers } from '@/templates/components/listOfLinkTeasers'
// import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
// import { EventTeaser } from '@/templates/components/eventTeaser'
// import { SocialLinks } from '@/templates/common/socialLinks'

const LOVELL_TRICARE_ADMINISTRATION_ID = 1039
const LOVELL_VA_ADMINISTRATION_ID = 1040

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcSystem({
  title,
  introText,
  image,
  administration,
  fieldRelatedLinks,
  path,
  menu,
  // vamcEhrSystem,
  // mainFacilities,
  // newsStoryTeasersFeatured,
  // eventTeasersFeatured,
  // eventTeasersAll,
  // lovellVariant,
  // lovellSwitchPath,
}: LovellStaticPropsResource<FormattedVamcSystem>) {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  })

  const imageStyle = '7_2_medium_thumbnail'
  const hasValidImage = image?.links?.[imageStyle]?.href

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        {/* Main page content */}
        <div className="usa-width-three-fourths">
          <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
            {/* <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            /> */}
            {title && <h1>{title}</h1>}
            {hasValidImage && (
              <div className="duotone darken lighten medium-screen:vads-u-margin-bottom--0p5">
                <MediaImage {...image} imageStyle={imageStyle} />
              </div>
            )}
            {/* Was going to use TopTasks, but the links are different, and the wrapper uses different classes */}
            <div className="usa-grid usa-grid-full vads-u-margin-top--0 vads-u-margin-bottom--3"></div>
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
            {administration?.id !== LOVELL_TRICARE_ADMINISTRATION_ID && (
              <section>
                <h2>
                  {administration?.id === LOVELL_VA_ADMINISTRATION_ID
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

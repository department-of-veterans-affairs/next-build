import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
import { MediaImage } from '@/templates/common/mediaImage'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { FacilityListing } from '@/templates/components/facilityListing'
import { RelatedLinks } from '@/templates/common/relatedLinks'
import { RegionalTopTasks } from '@/templates/components/topTasks'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { ManageYourHealthLinks } from '@/templates/layouts/vamcSystem/ManageYourHealthLinks'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { StoryTeaser } from './StoryTeaser'
import FacilitySocialLinks from '../healthCareLocalFacility/FacilitySocialLinks'
// import { ListOfLinkTeasers } from '@/templates/components/listOfLinkTeasers'
import { EventTeaser } from '@/templates/components/eventTeaser'
// import { SocialLinks } from '@/templates/common/socialLinks'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

const MAX_FEATURED_STORIES = 2

export function VamcSystem({
  title,
  introText,
  image,
  administration,
  path,
  menu,
  vamcEhrSystem,
  mainFacilities,
  relatedLinks,
  featuredStories,
  featuredEvents,
  otherEvents,
  lovellVariant,
  lovellSwitchPath,
  socialLinks,
}: LovellStaticPropsResource<FormattedVamcSystem>) {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  const imageStyle = '7_2_medium_thumbnail'
  const hasValidImage = image?.links?.[imageStyle]?.href

  console.log('featuredEvents', featuredEvents)
  console.log('otherEvents', otherEvents)

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        {/* Main page content */}
        <div className="usa-width-three-fourths">
          <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />
            {title && <h1>{title}</h1>}
            {hasValidImage && (
              <div className="duotone darken lighten medium-screen:vads-u-margin-bottom--0p5">
                <MediaImage {...image} imageStyle={imageStyle} alt="" />
              </div>
            )}
            <RegionalTopTasks
              path={path}
              administration={administration}
              vamcEhrSystem={vamcEhrSystem}
            />
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
              {mainFacilities.map((facility) => (
                <FacilityListing
                  key={facility.title}
                  facility={facility}
                  basePath={path}
                />
              ))}
              <va-link
                active
                className="vads-u-font-size--md vads-u-display--block vads-u-width--full"
                href={`${path}/locations`}
                text="See all locations"
              ></va-link>
            </section>

            {/* Manage your health online section */}
            {administration?.entityId !==
              LOVELL.tricare.administration.entityId && (
              <section>
                <h2>
                  {administration?.entityId ===
                  LOVELL.va.administration.entityId
                    ? 'Manage your VA health online'
                    : 'Manage your health online'}
                </h2>
                <ManageYourHealthLinks vamcEhrSystem={vamcEhrSystem} />
              </section>
            )}

            {/* Related links section */}
            <div className="vads-u-margin-top--5">
              <RelatedLinks {...relatedLinks} />
            </div>

            {/* Stories Section */}
            {featuredStories.length > 0 && (
              <section>
                <h2 className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-top--5">
                  Stories
                </h2>
                {featuredStories.slice(0, MAX_FEATURED_STORIES).map((story) => (
                  <StoryTeaser key={story.id} {...story} />
                ))}
                <p className="vads-u-margin-y--0">
                  <va-link
                    active
                    href={`${path}/stories`}
                    text="See all stories"
                  ></va-link>
                </p>
              </section>
            )}
            {/* Events Section */}
            {(featuredEvents.length > 0 ||
              otherEvents.length > 0) && (
              <section>
                <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--2p5">
                  Events
                </h2>
                {featuredEvents.length ? featuredEvents.map(
                  (event) => (
                    <EventTeaser key={event.entityId} {...event} />
                  )
                ) : otherEvents.slice(0, 1).map(
                  (event) => (
                    <EventTeaser key={event.entityId} {...event} />
                  )
                )}
                <va-link
                  active
                  className="vads-u-font-size--md vads-u-display--block vads-u-width--full"
                  href={`${path}/events`}
                  text="See all events"
                ></va-link>
              </section>
            )}
            {/* Social Links */}
            <FacilitySocialLinks {...socialLinks} />
            <va-back-to-top></va-back-to-top>
            <ContentFooter />
          </article>
        </div>
      </div>
    </div>
  )
}

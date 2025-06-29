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
  fallbackEvent,
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

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="vads-grid-container">
        {/* Nav data filled in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        <div className="vads-grid-row">
          <div className="vads-grid-col-12">
            <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
              <LovellSwitcher
                currentVariant={lovellVariant}
                switchPath={lovellSwitchPath}
              />
              {title && <h1>{title}</h1>}
              {hasValidImage && (
                <div className="duotone darken lighten tablet:vads-u-margin-bottom--0p5">
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
                <h2 className="vads-u-font-size--xl vads-u-margin-top--3 tablet:vads-u-margin-top--5 tablet:vads-u-margin-bottom--2p5">
                  Locations
                </h2>
                {mainFacilities.map((facility) => (
                  <FacilityListing
                    key={facility.title}
                    facility={facility}
                    basePath={path}
                  />
                ))}
                <p className="vads-u-margin-y--0">
                  <va-link
                    active
                    href={`${path}/locations`}
                    text="See all locations"
                  ></va-link>
                </p>
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
                  <h2 className="vads-u-margin-bottom--3 tablet:vads-u-margin-top--5">
                    Stories
                  </h2>
                  {featuredStories
                    .slice(0, MAX_FEATURED_STORIES)
                    .map((story) => (
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
              {(featuredEvents.length > 0 || fallbackEvent) && (
                <section>
                  <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 tablet:vads-u-margin-bottom--2p5">
                    Events
                  </h2>
                  {featuredEvents.length
                    ? featuredEvents.map((event) => (
                        <EventTeaser key={event.entityId} {...event} />
                      ))
                    : fallbackEvent && (
                        <EventTeaser
                          key={fallbackEvent.entityId}
                          {...fallbackEvent}
                        />
                      )}
                  <p className="vads-u-margin-y--0">
                    <va-link
                      active
                      href={`${path}/events`}
                      text="See all events"
                    ></va-link>
                  </p>
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
    </div>
  )
}

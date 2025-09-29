import { VamcSystem as FormattedVamcSystem } from './formatted-type'
import { MediaImage } from '@/components/mediaImage/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { FacilityListing } from '@/components/facilityListing/template'
import { RelatedLinks } from '@/components/relatedLinks/template'
import { RegionalTopTasks } from '@/components/topTasks/template'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { ManageYourHealthLinks } from './ManageYourHealthLinks'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { StoryTeaser } from './StoryTeaser'
import { VamcSystemSocialLinks } from '@/components/vamcSystemSocialLinks/template'
// import { ListOfLinkTeasers } from '@/templates/components/listOfLinkTeasers'
import { EventTeaser } from '@/components/eventTeaser/template'
// import { SocialLinks } from '@/templates/common/socialLinks'
import { SideNavLayout } from '@/components/sideNavLayout/template'

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
  const imageStyle = '7_2_medium_thumbnail'
  const hasValidImage = image?.links?.[imageStyle]?.href

  return (
    <div className="va-l-detail-page va-facility-page">
      <SideNavLayout menu={menu}>
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
                {administration?.entityId === LOVELL.va.administration.entityId
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
          <VamcSystemSocialLinks {...socialLinks} />
          <va-back-to-top></va-back-to-top>
          <ContentFooter />
        </article>
      </SideNavLayout>
    </div>
  )
}

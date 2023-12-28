/**
 * ### Overview
 * Story Listing represents an individual story within a Facility. These are used for human-interest articles.
 *
 * Story Listing expects data of type {@link StoryListingType}.
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { StoryListing as FormattedStoryListing } from '@/types/formatted/storyListing'
import { NewsStoryTeaser as FormattedNewsStoryTeaser } from '@/types/formatted/newsStory'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function StoryListing({
  id,
  title,
  introText,
  stories,
  menu,
  currentPage,
  totalPages,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedStoryListing>) {
  // Add data to the window object for the sidebar widget
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  const storyTeasers =
    stories?.length > 0 ? (
      stories?.map((story: FormattedNewsStoryTeaser) => (
        <li key={story.id}>
          <NewsStoryTeaser {...story} />
        </li>
      ))
    ) : (
      <li className="clearfix-text">No stories at this time.</li>
    )

  return (
    <div key={id} className="usa-grid usa-grid-full">
      {/* Widget coming from vets-website */}
      <nav
        data-template="navigation/facility_sidebar_nav"
        aria-label="secondary"
        data-widget-type="side-nav"
      ></nav>

      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <LovellSwitcher
            currentVariant={lovellVariant}
            switchPath={lovellSwitchPath}
          />
          <h1>{title}</h1>
          <div className="vads-l-grid-container--full">
            <div className="va-introtext">
              {introText && <p className="events-show">{introText}</p>}
            </div>
            <div className="vads-l-grid-container--full">
              <ul className="usa-unstyled-list">{storyTeasers}</ul>
            </div>

            {totalPages > 1 && (
              <VaPagination
                page={currentPage}
                pages={totalPages}
                maxPageListLength={3}
                onPageSelect={(page) => {
                  const newPage =
                    page.detail.page > 1 ? `page-${page.detail.page}` : ''
                  const newUrl = window.location.href.replace(
                    /(?<=stories\/).*/, // everything after /stories/
                    newPage
                  )
                  window.location.assign(newUrl)
                }}
              />
            )}
          </div>
        </article>
        <ContentFooter />
      </div>
    </div>
  )
}

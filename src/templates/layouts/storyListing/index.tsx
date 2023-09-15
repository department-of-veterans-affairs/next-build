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
import { NewsStoryTeaserType, StoryListingType } from '@/types/index'
import Container from '@/templates/common/container'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import { FacilityMenu } from '@/templates/components/facilityMenu'

export function StoryListing({
  id,
  title,
  introText,
  stories,
  menu,
  currentPage,
  totalPages,
}: StoryListingType) {
  const storyTeasers =
    stories?.length > 0 ? (
      stories?.map((story: NewsStoryTeaserType) => (
        <li key={story.id}>
          <NewsStoryTeaser {...story} />
        </li>
      ))
    ) : (
      <li className="clearfix-text">No stories at this time.</li>
    )

  return (
    <div key={id} className="usa-grid usa-grid-full">
      <FacilityMenu {...menu} />
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <h1>{title}</h1>
          <div className="vads-l-grid-container--full">
            <div className="va-introtext">
              {introText && <p className="events-show">{introText}</p>}
            </div>
            <Container className="container">
              <ul className="usa-unstyled-list">{storyTeasers}</ul>
            </Container>

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
      </div>
    </div>
  )
}

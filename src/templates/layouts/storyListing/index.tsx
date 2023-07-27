/**
 * ### Overview
 * Story Listing represents an individual story within a Facility. These are used for human-interest articles.
 *
 * Story Listing expects datca of type {@link StoryListingType}.
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */

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
        <h1>{title}</h1>
        <div className="vads-l-grid-container--full">
          <div className="va-introtext">
            {introText && <p className="events-show">{introText}</p>}
            <Container className="container">
              <ul className="usa-unstyled-list">{storyTeasers}</ul>
            </Container>
          </div>
        </div>
      </div>
    </div>
  )
}

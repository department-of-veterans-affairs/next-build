/**
 * ### Overview
 * Story Listing represents an individual story within a Facility. These are used for human-interest articles.
 *
 * Story Listing expects datca of type {@link StoryListingFullType}.
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */

import { NewsStoryTeaserType, StoryListingFullType } from '@/types/index'
import Container from '@/templates/common/container'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'

export function StoryListingFull({
  id,
  title,
  introText,
  stories,
}: StoryListingFullType) {
  const storyTeasers = stories.map((story: NewsStoryTeaserType) => (
    <NewsStoryTeaser key={story.id} {...story} />
  ))
  return (
    <div key={id} className="usa-grid usa-grid-full">
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

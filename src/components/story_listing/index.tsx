/**
 * ### Overview
 * Story Listing represents an individual story within a Facility. These are used for human-interest articles.
 *
 * Story Listing expects nodes of type {@link NodeStoryListing}.
 *
 * ### View modes
 * Teaser: {@link StoryListing}
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */

import Container from '@/components/container'
import { NewsStoryTeaser } from '@/components/newsStoryTeaser'
import { isValidData } from '@/utils/helpers'
import { recordEvent } from '@/utils/recordEvent'
import { transformNewsStoryTeaserData } from '@/components/newsStoryTeaser/dataService'

/** General Story Listing component. Allows choice of different display components by the caller. */
export const StoryListing = ({ node, additionalNode }): JSX.Element => {
  if (!isValidData(node || additionalNode)) {
    return
  }

  return (
    <>
      {node.map((storyListing) => (
        <div key={storyListing.id} className="usa-grid usa-grid-full">
          {/*<div className="usa-width-three-fourths">*/}
          <h1>{storyListing.title}</h1>
          <div className="vads-l-grid-container--full">
            <div className="va-introtext">
              {storyListing.field_intro_text && (
                <p className="events-show">{storyListing.field_intro_text}</p>
              )}
              {additionalNode.length === 0 ||
                (additionalNode.length === null && (
                  <div className="clearfix-text">No stories at this time.</div>
                ))}
              {additionalNode.length && (
                <Container className="container">
                  <ul className="usa-unstyled-list">
                    <NewsStoryTeaser
                      {...transformNewsStoryTeaserData(additionalNode)}
                    />
                  </ul>
                </Container>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export const StoryListingTeaser = ({ path }) => {
  return (
    // @todo can <Link /> be used here?
    <a
      onClick={() =>
        recordEvent({
          event: 'nav-secondary-button-click',
        })
      }
      className="vads-u-display--block vads-u-margin-bottom--7"
      href={path}
      id="news-stories-listing-link"
    >
      See all stories
    </a>
  )
}

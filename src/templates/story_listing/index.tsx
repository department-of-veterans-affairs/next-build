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

import { recordEvent } from '@/lib/utils/recordEvent'

export type StoryListingProps = {
  id: string
  title: string
  introText: string
}

function isRequestInvalid(storyListing) {
  return !storyListing.title || !storyListing.introText
}

/** General Story Listing component. Allows choice of different display components by the caller. */
export function StoryListing(storyListing: StoryListingProps) {
  if (isRequestInvalid(storyListing)) return

  return (
    <div key={storyListing.id} className="usa-grid usa-grid-full">
      {/*<div className="usa-width-three-fourths">*/}
      <h1>{storyListing.title}</h1>
      <div className="vads-l-grid-container--full">
        <div className="va-introtext">
          {storyListing.introText && (
            <p className="events-show">{storyListing.introText}</p>
          )}
          {/*{storyListing.additionalNode.length === 0 ||*/}
          {/*  (storyListing.additionalNode.length === null && (*/}
          <div className="clearfix-text">No stories at this time.</div>
          {/*))}*/}
          {/*{additionalNode.length && (*/}
          {/*  <Container className="container">*/}
          {/*    <ul className="usa-unstyled-list">*/}
          {/*      {additionalNode.map((newsStoryTeaser) => (*/}
          {/*        <NewsStoryTeaser*/}
          {/*          key={newsStoryTeaser.id}*/}
          {/*          {...transformNewsStoryTeaserData(newsStoryTeaser)}*/}
          {/*        />*/}
          {/*      ))}*/}
          {/*    </ul>*/}
          {/*  </Container>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
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

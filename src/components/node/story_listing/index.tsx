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


/** These types/packages will import into all node components. */
import { NodeMetaInfo, NodeResourceType } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/**
 * These components expect NodeStoryListing as their input.
 */

import Container from '@/components/container'
import { NewsStory } from '@/components/node/news_story'
import { isValidData } from '@/utils/helpers'

/** General Story Listing component. Allows choice of different display components by the caller. */
const StoryListing = ({ node, additionalNode }): JSX.Element => {
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
              <Container className="container">
                <ul className="usa-unstyled-list">
                  {additionalNode.map((newsStoryTeaser) => (
                    <NewsStory
                      node={newsStoryTeaser}
                      key={newsStoryTeaser.id}
                      viewMode="teaser"
                    />
                  ))}
                </ul>
              </Container>
            </div>
          </div>
          {/*</div>*/}
        </div>
      ))}
    </>
  )
}

export default StoryListing

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addFilter('status', '1')
  .addSort('created', 'DESC')

const newsStory = new DrupalJsonApiParams()
  .addInclude(['field_media', 'field_media.image', 'field_listing'])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */

export const Meta: NodeMetaInfo = {
  resource: NodeResourceType.StoryListing,
  component: StoryListing,
  params: params,
  additionalNode: NodeResourceType.NewsStory,
  additionalParams: newsStory,
  collection: true,
}

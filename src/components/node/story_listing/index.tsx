/**
 * ### Overview
 * News Story represents an individual story within a Facility. These are used for human-interest articles.
 *
 * News Story expects nodes of type {@link NodeNewsStory}.
 *
 * ### View modes
 * Full page: {@link NewsStoryFull}
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/we-honor-outstanding-doctors
 *


/** These types/packages will import into all node components. */
import { NodeMetaInfo } from '@/components/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/**
 * These components expect NodeNewsStory as their input.
 */
import Container from '@/components/container'
import { NewsStoryTeaser } from '@/components/node/news_story'

/** General News Story component. Allows choice of different display components by the caller. */
const StoryListing = ({ node, additional }): JSX.Element => {
  if (!node) return

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
              {additional.length === 0 ||
                (additional.length === null && (
                  <div className="clearfix-text">No stories at this time.</div>
                ))}
              <Container className="container">
                <ul className="usa-unstyled-list">
                  {additional.map((newsStoryTeaser) => (
                    <NewsStoryTeaser
                      key={newsStoryTeaser.id}
                      node={newsStoryTeaser}
                      viewMode={'teaser'}
                      headingLevel={null}
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
  .addFilter('drupal_internal__nid', '2806')
  .addSort('created', 'DESC')

const newsStory = new DrupalJsonApiParams()
  .addInclude(['field_media', 'field_media.image', 'field_listing'])
  .addPageLimit(20)

/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */
export const Meta: NodeMetaInfo = {
  resource: 'node--story_listing',
  component: StoryListing,
  params: params,
  collection: true,
  additional: 'node--news_story',
  extra: newsStory,
}

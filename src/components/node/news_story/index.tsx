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
 */

/** These types/packages will import into all node components. */
import { NodeMetaInfo } from '@/components/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** These component includes are specific to this component. */
import { MediaImageComponent } from '@/components/media'
import { StaffNewsProfile } from '@/components/node/person_profile'
import { NodeNewsStory } from '@/types/node'

/**
 * These components expect NodeNewsStory as their input.
 */
export type NodeNewsStoryProps = {
  node: NodeNewsStory
  viewMode?: string
}

/** Full page news story. */
export const NewsStoryFull = ({ node }: NodeNewsStoryProps) => {
  /** Type narrowing; if we've managed to end up here with the wrong data, return. */
  if (node?.type !== 'node--news_story') return
  const dateTime = new Date(node.created).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <>
      <div id="content" className="interior">
        <main className="va-l-detail-page va-facility-page">
          <div className="usa-grid usa-grid-full">
            {/* nav here */}
            <div className="usa-width-three-fourths">
              <article className="usa-content">
                <h1>{node.title}</h1>
                <MediaImageComponent
                  image={node.field_media}
                  imageStyle={'2_1_large'}
                />
                <div className="vads-u-font-size--sm vads-u-margin-bottom--2p5">
                  {node.field_image_caption}
                </div>
                <StaffNewsProfile node={node.field_author} />
                <div className="created-line vads-u-margin-bottom--2p5">
                  <time dateTime="{ dateTime }">{dateTime}</time>
                </div>

                {/* {% include "src/site/facilities/story_social_share.drupal.liquid" %} */}

                <div className="usa-grid usa-grid-full vads-u-margin-bottom--2">
                  <div className="va-introtext">
                    <p>{node.field_intro_text}</p>
                  </div>
                  <div
                    className="full-story"
                    dangerouslySetInnerHTML={{
                      __html: node.field_full_story?.processed,
                    }}
                  ></div>
                </div>
                {/* {% if fieldListing.entity.entityUrl.path %}
                        <a onClick="recordEvent({ event: 'nav-secondary-button-click' });" className="vads-u-display--block vads-u-margin-bottom--7" href="{{ fieldListing.entity.entityUrl.path }}" id="news-stories-listing-link">See all stories</a>
                    {% endif %} */}
              </article>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const NewsStoryTeaser = ({ node }: NodeNewsStoryProps) => {
  return (
    <article
      data-template="teasers/news_story_page_feature"
      id={`featured-content-${node.id}`}
      className="featured-story
      usa-grid
      usa-grid-full
      vads-u-margin-bottom--3
      medium-screen:vads-u-margin-bottom--4
      vads-u-display--flex
      vads-u-flex-direction--column
      medium-screen:vads-u-flex-direction--row
      vads-u-border-left--7px
      vads-u-border-color--primary-alt-lightest"
    >
      <div className="usa-width-one-half medium-screen:vads-u-padding-left--2">
        <span className="vads-u-font-weight--bold vads-u-display--block">
          In the spotlight at
        </span>
        <h2 className="vads-u-font-size--md medium-screen:vads-u-font-size--lg vads-u-margin-top--0 medium-screen:vads-u-margin-bottom--0p5">
          {node.title}
        </h2>
        <div className="vads-l-grid-container--full">
          <div className="va-introtext">
            <p className="events-show" id="office-events-description">
              {node.field_intro_text}
            </p>
          </div>
        </div>
        <div className="usa-width-one-half vads-u-order--first medium-screen:vads-u-order--initial vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
          <MediaImageComponent
            image={node.field_media}
            imageStyle={'1_1_square_medium_thumbnail'}
          />
        </div>
      </div>
    </article>
  )
}

/** General News Story component. Allows choice of different display components by the caller. */
export const NewsStory = ({ node, viewMode, ...props }: NodeNewsStoryProps) => {
  switch (viewMode) {
    case 'full':
      return <NewsStoryFull node={node} {...props} />
      break
    case 'teaser':
      return <NewsStoryTeaser node={node} {...props} />
      break
    default:
      return null
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude([
    'field_media',
    'field_media.image',
    'field_author',
    'field_listing',
  ])
  .addPageLimit(10)
/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */
export const Meta: NodeMetaInfo = {
  resource: 'node--news_story',
  component: NewsStory,
  params: params,
}

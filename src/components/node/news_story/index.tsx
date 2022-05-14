import { JsonApiResource } from 'next-drupal'
import { MediaImage } from '@/components/media'
import { StaffNewsProfile } from '@/components/node/person_profile'

interface NodeProps {
  node: JsonApiResource
}

const FullPage = ({ node }: NodeProps) => {
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
                <MediaImage media={node.field_media} imageStyle={'2_1_large'} />
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
                      __html: node.field_full_story.processed,
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

export default FullPage

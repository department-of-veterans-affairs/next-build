import { NewsStoryTeaser } from '@/components/node/news_story'
import Container from '@/components/container'
import { ViewMode } from '@/utils/enums'

const StoryListing = ({
  nodeStoryListings,
  nodeNewsStoryTeasers,
}): JSX.Element => {
  if (!nodeStoryListings.length) return null

  return (
    <>
      {nodeStoryListings.map((storyListing) => (
        <div key={storyListing.id} className="usa-grid usa-grid-full">
          {/*<div className="usa-width-three-fourths">*/}
          <h1>{storyListing.title}</h1>
          <div className="vads-l-grid-container--full">
            <div className="va-introtext">
              {storyListing.field_intro_text && (
                <p className="events-show">{storyListing.field_intro_text}</p>
              )}
              {nodeNewsStoryTeasers.length === 0 ||
                (nodeNewsStoryTeasers.length === null && (
                  <div className="clearfix-text">No stories at this time.</div>
                ))}
              <Container className="container">
                <ul className="usa-unstyled-list">
                  {nodeNewsStoryTeasers.map((newsStoryTeaser) => (
                    <NewsStoryTeaser
                      key={newsStoryTeaser.id}
                      node={newsStoryTeaser}
                      viewMode={ViewMode.TEASER}
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

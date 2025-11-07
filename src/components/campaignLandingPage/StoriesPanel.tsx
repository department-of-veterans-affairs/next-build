import { MediaImage } from '../mediaImage/template'
import { CampaignLandingPageProps } from './template'

import styles from './StoriesPanel.module.css'

export const StoriesPanel = ({ stories }: CampaignLandingPageProps) => {
  if (!stories?.show) {
    return null
  }

  return (
    <div
      className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
      data-testid="stories-panel"
    >
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            Stories
          </p>
          <h2 className="vads-u-margin-top--0">{stories.header}</h2>
          <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
            {stories.intro}
          </p>

          {stories.teasers.length && (
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              {stories.teasers.map((storyTeaser) => (
                <div
                  key={storyTeaser.entityId}
                  className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4"
                >
                  {storyTeaser.image && (
                    <MediaImage
                      {...storyTeaser.image}
                      data-testid="stories-teaser-image"
                      className={`${styles.storyImage} vads-u-height--full medium-screen:vads-u-margin-right--2`}
                      imageStyle="3_2_medium_thumbnail"
                    />
                  )}

                  <div className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--0">
                    <h3
                      className="vads-u-margin-top--0"
                      aria-label={storyTeaser.teaser.title}
                    >
                      {storyTeaser.teaser && (
                        <va-link
                          active
                          data-testid="stories-teaser-link"
                          href={storyTeaser.teaser.uri}
                          text={storyTeaser.teaser.title}
                        ></va-link>
                      )}
                    </h3>
                    <p>{storyTeaser.teaser.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stories.cta && (
            <va-link-action
              type="secondary"
              href={stories.cta.url}
              text={stories.cta.label}
            />
          )}
        </div>
      </div>
    </div>
  )
}

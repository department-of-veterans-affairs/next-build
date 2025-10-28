import {
  VaLink,
  VaLinkAction,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { placeholders } from './placeholders.temp'

export const StoriesPanel = () => {
  return (
    placeholders.fieldClpStoriesPanel && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              Stories
            </p>
            <h2 className="vads-u-margin-top--0">
              {placeholders.fieldClpStoriesHeader}
            </h2>
            <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
              {placeholders.fieldClpStoriesIntro}
            </p>

            {placeholders.fieldClpStoriesTeasers &&
              placeholders.fieldClpStoriesTeasers.length > 0 && (
                <div className="vads-u-display--flex vads-u-flex-direction--column">
                  {placeholders.fieldClpStoriesTeasers.map(
                    (storyTeaser, index) => (
                      <div
                        key={index}
                        className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4"
                      >
                        {storyTeaser.entity.fieldMedia.entity.thumbnail
                          .derivative.url && (
                          <img
                            alt={storyTeaser.entity.fieldMedia.entity.image.alt}
                            className="story-image vads-u-height--full medium-screen:vads-u-margin-right--2"
                            height={
                              storyTeaser.entity.fieldMedia.entity.thumbnail
                                .derivative.height
                            }
                            src={
                              storyTeaser.entity.fieldMedia.entity.thumbnail
                                .derivative.url
                            }
                            width={
                              storyTeaser.entity.fieldMedia.entity.thumbnail
                                .derivative.width
                            }
                          />
                        )}
                        <div className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--0">
                          <h3 className="vads-u-margin-top--0">
                            {/* TODO: determineFieldLink filter - using direct URL path */}
                            {storyTeaser.entity.fieldLinkTeaser.entity.fieldLink
                              .url.path && (
                              <VaLink
                                active
                                href={
                                  storyTeaser.entity.fieldLinkTeaser.entity
                                    .fieldLink.url.path
                                }
                                text={
                                  storyTeaser.entity.fieldLinkTeaser.entity
                                    .fieldLink.title
                                }
                              ></VaLink>
                            )}
                          </h3>
                          <p>
                            {
                              storyTeaser.entity.fieldLinkTeaser.entity
                                .fieldLinkSummary
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

            {placeholders.fieldClpStoriesCta.uri && (
              <VaLinkAction
                href={placeholders.fieldClpStoriesCta.uri}
                type="secondary"
                text="See more stories"
              />
            )}
          </div>
        </div>
      </div>
    )
  )
}

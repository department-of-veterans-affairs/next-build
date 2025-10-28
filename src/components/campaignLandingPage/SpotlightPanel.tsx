import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { placeholders } from './placeholders.temp'

export const SpotlightPanel = () => {
  return (
    placeholders.fieldClpSpotlightPanel && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              Spotlight
            </p>
            <h2 className="vads-u-margin-top--0">
              {placeholders.fieldClpSpotlightHeader}
            </h2>
            <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
              {placeholders.fieldClpSpotlightIntroText}
              {placeholders.fieldClpSpotlightCta.entity.fieldButtonLink.url
                .path &&
                placeholders.fieldClpSpotlightCta.entity.fieldButtonLabel && (
                  <VaLink
                    href={
                      placeholders.fieldClpSpotlightCta.entity.fieldButtonLink
                        .url.path
                    }
                    text={
                      placeholders.fieldClpSpotlightCta.entity.fieldButtonLabel
                    }
                  ></VaLink>
                )}
            </p>
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
          {placeholders.fieldClpSpotlightLinkTeasers.map(
            (linkTeaser, index) => (
              <div
                key={index}
                className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
              >
                <div className="vads-u-background-color--gray-light-alt vads-u-height--full medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
                  <div className="vads-u-padding--2">
                    <h3 className="vads-u-margin-top--0">
                      {/* TODO: determineFieldLink filter - using direct URL path */}
                      {linkTeaser.entity.fieldLink.url.path && (
                        <VaLink
                          active
                          href={linkTeaser.entity.fieldLink.url.path}
                          text={linkTeaser.entity.fieldLink.title}
                        ></VaLink>
                      )}
                    </h3>
                    <p className="vads-u-margin-top--1">
                      {linkTeaser.entity.fieldLinkSummary}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )
  )
}

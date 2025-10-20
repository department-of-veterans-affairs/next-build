import { placeholders } from '../placeholders.temp'

export const WhyThisMatters = ({ title }: { title: string }) => {
  return (
    <div className="vads-u-background-color--primary-alt-lightest">
      <div className="vads-l-grid-container vads-u-padding-y--6 vads-u-padding-bottom--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <h2 className="vads-u-margin--0 vads-u-margin-bottom--2">
              Why this matters to you
            </h2>
            <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
              {placeholders.fieldClpWhyThisMatters}
            </p>
            {placeholders.fieldSecondaryCallToAction && (
              <va-link-action
                href={
                  placeholders.fieldSecondaryCallToAction.entity.fieldButtonLink
                    .url.path
                }
                type="secondary"
                text={
                  placeholders.fieldSecondaryCallToAction.entity
                    .fieldButtonLabel
                }
              />
            )}
          </div>
          <div className="vads-l-col--12 medium-screen:vads-l-col--3 medium-screen:vads-u-margin-left--6">
            <div className=" vads-u-margin-top--3 medium-screen:vads-u-margin-top--0">
              {placeholders.fieldClpAudience &&
                placeholders.fieldClpAudience.length > 0 && (
                  <div className="vads-u-background-color--white vads-u-padding--2 vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--2">
                    <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin--0">
                      This page is for
                    </p>
                    <hr className="va-c-blue-line vads-u-border-color--primary-alt vads-u-margin-y--2" />
                    <ul className="usa-unstyled-list" role="list">
                      {placeholders.fieldClpAudience.map(
                        (clpAudience, index) => (
                          <li
                            key={index}
                            className="vads-u-font-size--sm vads-u-font-weight--bold vads-u-margin-top--2 vads-u-line-height--2"
                          >
                            {clpAudience.entity.name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              <div data-template="includes/social-share" id="va-c-social-share">
                <ul className="usa-unstyled-list" role="list">
                  <li className="vads-u-margin-bottom--2p5">
                    <va-icon
                      icon="facebook"
                      size="3"
                      className="vads-u-color--link-default"
                    ></va-icon>
                    <va-link
                      className="va-js-share-link"
                      href={`https://www.facebook.com/sharer/sharer.php?href=${placeholders.hostUrl}${placeholders.entityUrl.path}`}
                      text="Share on Facebook"
                    ></va-link>
                  </li>
                  <li>
                    <va-icon
                      icon="x"
                      size="3"
                      className="vads-u-color--link-default"
                    ></va-icon>
                    <va-link
                      className="va-js-share-link"
                      href={`https://twitter.com/intent/tweet?text=${title}&url=${placeholders.hostUrl}${placeholders.entityUrl.path}`}
                      text="Share on X (formerly Twitter)"
                    ></va-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

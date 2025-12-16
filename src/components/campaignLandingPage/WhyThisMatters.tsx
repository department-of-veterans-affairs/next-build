import { CampaignLandingPageProps } from './template'

export const WhyThisMatters = ({
  whyThisMatters,
  audience,
  cta,
  socialLinks,
}: CampaignLandingPageProps) => {
  return (
    <div
      className="vads-u-background-color--primary-alt-lightest"
      data-testid="why-this-matters"
    >
      <div className="vads-grid-container vads-u-padding-y--6 vads-u-padding-bottom--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-grid-row">
          <div className="vads-grid-col-8">
            <h2 className="vads-u-margin--0 vads-u-margin-bottom--2">
              Why this matters to you
            </h2>
            <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
              {whyThisMatters}
            </p>
            {cta.secondary && (
              <va-link-action
                data-testid="secondary-cta"
                href={cta.secondary.href}
                type="secondary"
                text={cta.secondary.label}
              />
            )}
          </div>
          <div className="vads-grid-col-12 medium-screen:vads-grid-col-3 medium-screen:vads-u-margin-left--6">
            <div className=" vads-u-margin-top--3 medium-screen:vads-u-margin-top--0">
              {audience.length > 0 && (
                <div className="vads-u-background-color--white vads-u-padding--2 vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--2">
                  <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin--0">
                    This page is for
                  </p>
                  <hr className="va-c-blue-line vads-u-border-color--primary-alt vads-u-margin-y--2" />
                  {audience?.length && (
                    <ul className="usa-unstyled-list" role="list">
                      {audience.map((audience, i) => (
                        <li
                          key={i}
                          className="vads-u-font-size--sm vads-u-font-weight--bold vads-u-margin-top--2 vads-u-line-height--2"
                        >
                          {audience.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div data-template="includes/social-share" id="va-c-social-share">
                <ul className="usa-unstyled-list" role="list">
                  {socialLinks.map((socialLink, i) => (
                    <li
                      key={i}
                      className={
                        i !== socialLinks.length - 1 &&
                        `vads-u-margin-bottom--2p5`
                      }
                    >
                      <va-icon
                        icon={socialLink.icon}
                        size="3"
                        className="vads-u-color--link-default"
                      ></va-icon>
                      &nbsp;
                      <va-link
                        className="va-js-share-link"
                        href={socialLink.href}
                        text={socialLink.text}
                      ></va-link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

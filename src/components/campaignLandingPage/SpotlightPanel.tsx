import { CampaignLandingPageProps } from './template'

export const SpotlightPanel = ({ spotlight }: CampaignLandingPageProps) => {
  if (!spotlight.show) {
    return
  }

  return (
    <div
      className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
      data-testid="spotlight-panel"
    >
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            Spotlight
          </p>
          <h2 className="vads-u-margin-top--0">{spotlight.header}</h2>
          <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
            {spotlight.intro}
            {spotlight.cta && (
              <va-link
                href={spotlight.cta.url}
                text={spotlight.cta.label}
              ></va-link>
            )}
          </p>
        </div>
      </div>
      <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
        {spotlight.teasers.map((linkTeaser) => (
          <div
            key={linkTeaser.id}
            className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1"
          >
            <div className="vads-u-background-color--gray-light-alt vads-u-height--full medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
              <div className="vads-u-padding--2">
                <h3
                  className="vads-u-margin-top--0"
                  aria-label={linkTeaser.title}
                >
                  <va-link
                    active
                    href={linkTeaser.uri}
                    text={linkTeaser.title}
                  ></va-link>
                </h3>
                <p className="vads-u-margin-top--1">{linkTeaser.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

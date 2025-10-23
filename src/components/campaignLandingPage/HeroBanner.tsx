import type { CampaignLandingPageProps } from './template'
import { MediaImage } from '../mediaImage/template'

export const HeroBanner = ({ title, hero }: CampaignLandingPageProps) => {
  return (
    <div className="va-u-background--gradiant-blue" data-testid="hero-banner">
      <div className="vads-l-grid-container vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-col--12 small-screen:vads-l-col--10 medium-screen:vads-l-col--8 small-desktop-screen:vads-l-col--12">
          <div className="vads-u-display--flex small-desktop-screen:vads-l-row">
            <div className="vads-l-col--12 small-desktop-screen:vads-l-col--6 vads-u-padding-top--4 vads-u-padding-bottom--6 desktop:vads-u-padding-right--4">
              <h1 className="vads-u-color--white">{title}</h1>
              <hr className="va-c-blue-line--large vads-u-border-color--primary-alt vads-u-border--2px vads-u-margin-y--2" />
              <p className="va-introtext vads-u-color--white">{hero.blurb}</p>

              {hero.cta.primary && (
                <va-link-action
                  data-testid="primary-cta"
                  className="vads-u-margin-top--2"
                  href={hero.cta.primary.href}
                  type="reverse"
                  text={hero.cta.primary.label}
                />
              )}
            </div>
            <div className="vads-u-display--none desktop:vads-u-display--block">
              <MediaImage
                {...hero.image}
                imageStyle="1_1_square_large"
                style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

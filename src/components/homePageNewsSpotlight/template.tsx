import { NewsSpotlightData } from './formatted-type'
import { MediaImage } from '@/components/mediaImage/template'

export function HomePageNewsSpotlight({
  image,
  headline,
  link,
  promoText,
}: NewsSpotlightData) {
  return (
    <div
      className="vads-u-background-color--primary-dark"
      data-e2e="news"
      data-testid="news-spotlight"
    >
      <div className="vads-grid-container vads-u-padding-x--0 homepage-blog">
        <div className="vads-grid-row">
          {/* start first column */}
          <div className="vads-grid-col-12 vads-u-display--none desktop:vads-u-display--block tablet:vads-grid-col-4">
            <div className="homepage-blog__image">
              <MediaImage {...image} imageStyle="crop_square" />
            </div>
          </div>
          {/* end first column */}

          {/* start second column */}
          <div className="vads-grid-col-12 tablet:vads-grid-col-8">
            <div className="vads-u-padding--2p5 desktop:vads-u-padding--6 desktop:vads-u-padding-right--0 vads-u-color--white">
              <h2 className="vads-u-font-size--base vads-u-margin-top--0 vads-u-font-weight--normal vads-u-font-family--sans">
                VA NEWS
              </h2>
              <h3 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--xl">
                <va-link href={link.url} text={headline} reverse></va-link>
              </h3>

              <p className="vads-u-padding-right--0 desktop:vads-u-padding-right--8 vads-u-margin-bottom--3 desktop:vads-u-margin-bottom--6">
                {promoText}{' '}
                <va-link
                  reverse
                  label={`${link.text} about ${headline}`}
                  href={link.url}
                  text={link.text}
                />
              </p>

              <p>
                <va-link
                  href="https://news.va.gov/"
                  text="More VA news"
                  active
                  reverse
                ></va-link>
              </p>
            </div>
          </div>
          {/* end second column */}
        </div>
      </div>
    </div>
  )
}

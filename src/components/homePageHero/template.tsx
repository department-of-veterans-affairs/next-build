import { useSearchParams } from 'next/navigation'
import { HomePageHero as FormattedHomePageHero } from './formatted-type'

export function HomePageHero({
  promoHeadline,
  promoCta,
  promoText,
  ctaSummaryText,
  primaryCtaButtonText,
  relatedInfoLinks,
}: FormattedHomePageHero) {
  const searchParams = new URLSearchParams(useSearchParams().toString())
  return (
    <div className="homepage-hero__wrapper" data-testid="hero">
      <div className="vads-grid-container vads-u-padding-x--0">
        <div className="vads-grid-row">
          <div className="vads-grid-col-12 tablet:vads-grid-col-6">
            <div
              className="vads-u-padding-left--2 vads-u-padding-right--3 vads-u-padding-top--5
                vads-u-padding-bottom--3
                desktop:vads-u-padding-bottom--8"
            >
              <h1 className="homepage-hero__welcome-headline vads-u-color--white vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-y--1 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-font-size--lg vads-u-font-family--serif">
                Welcome to VA.gov
              </h1>
              <h2 className="vads-u-color--white vads-u-margin-top--3 vads-u-font-size--xl desktop:vads-u-font-size--2xl">
                {promoHeadline}
              </h2>
              {promoText && (
                <p
                  id="myva-login--hero"
                  className="vads-u-color--white vads-u-padding-right--5"
                >
                  {promoText}
                </p>
              )}
              {promoCta.title && promoCta.url && (
                <va-link-action
                  data-testid="promoCta"
                  type="reverse"
                  href={promoCta.url}
                  text={promoCta.title}
                />
              )}
            </div>
          </div>
          <div className="vads-grid-col-12 tablet:vads-grid-col-6 vads-u-display--flex">
            <div className="vads-u-display--flex vads-u-width--full vads-u-align-items--center vars-u-justify-content--center">
              <div className="va-flex vads-u-flex-direction--column vads-u-align-items--flex-start vads-u-background-color--white vads-u-margin-top--3 vads-u-margin-bottom--6 vads-u-padding-x--3 vads-u-padding-y--2 vads-u-width--full homepage-hero__create-account vads-u-display--none">
                <h2 className="vads-u-font-size--md vads-u-line-height--5 vads-u-color--gray vads-u-margin-top--0 vads-u-padding-right--2 vads-u-font-family--sans vads-u-font-weight--normal">
                  {ctaSummaryText}
                </h2>
                <va-button
                  className="vads-u-margin-bottom--3"
                  data-testid="ctaButton"
                  text={primaryCtaButtonText}
                  onClick={() => {
                    searchParams.set('next', 'loginModal')
                    document.location = `?${searchParams.toString()}`
                  }}
                />
                {relatedInfoLinks.map((link, index) => (
                  <va-link
                    data-testid={`related-link-${index}`}
                    key={index}
                    href={link.url}
                    text={link.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

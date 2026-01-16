import { SignupForm } from './SignupForm'

export function HomePageEmailSignup() {
  return (
    <div
      className="homepage-email-update-wrapper vads-u-background-color--primary-alt-lightest vads-u-padding-x--2p5 vads-u-padding-top--2p5"
      data-testid="home-page-email-signup"
    >
      <SignupForm />
      <div
        id="vets-banner-1"
        className="vads-u-display--none tablet:vads-u-display--block"
      >
        <div className="veteran-banner-container vads-u-margin-y--0 vads-u-margin-x--auto">
          <picture>
            <source
              srcSet="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-mobile-1.png 640w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-mobile-2.png 920w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-mobile-3.png 1316w"
              media="(max-width: 767px)"
            />
            <source
              srcSet="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-tablet-1.png 1008w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-tablet-2.png 1887w"
              media="(max-width: 1008px)"
            />
            <img
              className="vads-u-width--full"
              src="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-desktop-1.png"
              srcSet="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-desktop-1.png 1280w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-desktop-2.png 2494w"
              loading="lazy"
              alt="Veteran portraits"
            />
          </picture>
        </div>
      </div>
    </div>
  )
}

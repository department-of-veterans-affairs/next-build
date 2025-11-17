import Image from 'next/image'

export const TopNav = () => {
  return (
    <div id="legacy-header" className="vads-u-display--none">
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <div className="usa-banner">
            <div className="usa-accordion">
              <div className="usa-banner-header">
                <div className="usa-grid usa-banner-inner">
                  <Image
                    src="/img/tiny-usa-flag.png"
                    alt="U.S. flag"
                    height="20"
                    width="20"
                  />
                  <p>An official website of the United States government</p>
                  <button
                    id="usa-banner-toggle"
                    className="usa-accordion-button usa-banner-button"
                    aria-expanded="false"
                    aria-controls="gov-banner"
                  >
                    <span className="usa-banner-button-text">
                      Here’s how you know
                    </span>
                  </button>
                </div>
              </div>
              <div
                className="usa-banner-content usa-grid usa-accordion-content"
                id="gov-banner"
                aria-hidden="true"
              >
                <div className="usa-banner-guidance-gov usa-width-one-half">
                  <Image
                    className="usa-banner-icon usa-media_block-img"
                    src="/img/icon-dot-gov.svg"
                    alt="Dot gov"
                    height="38"
                    width="38"
                  />
                  <div className="usa-media_block-body">
                    <p>
                      <strong>The .gov means it’s official.</strong>
                      <br />
                      Federal government websites often end in .gov or .mil.
                      Before sharing sensitive information, make sure
                      you&apos;re on a federal government site.
                    </p>
                  </div>
                </div>
                <div className="usa-banner-guidance-ssl usa-width-one-half">
                  <Image
                    className="usa-banner-icon usa-media_block-img"
                    src="/img/icon-https.svg"
                    alt="SSL"
                    height={'38'}
                    width="38"
                  />
                  <div className="usa-media_block-body">
                    <p>
                      <strong>The site is secure.</strong>
                      <br /> The <strong>https://</strong> ensures that
                      you&apos;re connecting to the official website and that
                      any information you provide is encrypted and sent
                      securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="va-crisis-line-container vads-u-background-color--secondary-darkest">
          <button
            className="va-crisis-line va-overlay-trigger vads-u-background-color--secondary-darkest"
            data-show="#modal-crisisline"
          >
            <div className="va-crisis-line-inner">
              <span className="va-crisis-line-icon" aria-hidden="true"></span>
              <span className="va-crisis-line-text">
                Talk to the <strong>Veterans Crisis Line</strong> now
              </span>
              <Image
                alt=""
                aria-hidden="true"
                className="va-crisis-line-arrow"
                src="/img/arrow-right-white.svg"
                height={'29'}
                width="13"
              />
            </div>
          </button>
        </div>
      </div>
      {/* <!-- /header alert box --> */}

      <div
        className="row va-flex usa-grid usa-grid-full"
        id="va-header-logo-menu"
      >
        <div className="va-header-logo-wrapper">
          <a href="/" className="va-header-logo">
            <Image
              src="/img/header-logo.png"
              alt="VA logo and Seal, U.S. Department of Veterans Affairs"
              height="59"
              width="264"
            />
          </a>
        </div>

        {/* <div id="va-nav-controls"></div> */}

        <div className="medium-screen:vads-u-display--none usa-grid usa-grid-full">
          <div className="menu-rule usa-one-whole"></div>
          <div className="mega-menu" id="mega-menu-mobile"></div>
        </div>

        <div id="login-root" className="vet-toolbar"></div>
      </div>

      <div className="usa-grid usa-grid-full">
        <div className="menu-rule usa-one-whole"></div>
        <div className="mega-menu" id="mega-menu"></div>
      </div>
    </div>
  )
}

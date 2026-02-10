import Image from 'next/image'

export const TopNav = () => {
  return (
    <div id="legacy-header" className="vads-u-display--none">
      <div className="va-notice--banner">
        <div className="va-notice--banner-inner">
          <div className="usa-banner">
            <div className="usa-accordion">
              <div className="usa-banner-header">
                <div className="vads-grid-container usa-banner-inner">
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
                className="usa-banner-content vads-grid-container usa-accordion-content"
                id="gov-banner"
                aria-hidden="true"
              >
                <div className="usa-banner-guidance-gov vads-grid-col-6">
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
                <div className="usa-banner-guidance-ssl vads-grid-col-6">
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
        className="vads-grid-container vads-u-padding-x--0 desktop:vads-u-padding-x--1p5"
        id="va-header-logo-menu"
      >
        <div className="vads-grid-row va-flex vads-u-margin-x--1p5">
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

          <div className="tablet:vads-u-display--none vads-grid-container">
            <div className="menu-rule"></div>
            <div className="mega-menu" id="mega-menu-mobile"></div>
          </div>

          <div
            id="login-root"
            className="vet-toolbar vads-u-margin-y--0p5"
          ></div>
        </div>
      </div>

      <div className="vads-grid-container vads-u-padding-x--0">
        <div className="vads-u-width--full vads-u-align-items--center">
          <div className="menu-rule vads-u-margin-x--0"></div>
        </div>
        <div className="mega-menu" id="mega-menu"></div>
      </div>
    </div>
  )
}

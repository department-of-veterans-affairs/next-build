export function HomePageHero() {
  const fieldPromoHeadline = 'headline'
  const fieldPromoCta = {
    entity: {
      fieldButtonLabel: 'button label',
      fieldButtonLink: {
        url: {
          path: 'https://google.com',
        },
      },
    },
  }
  const fieldPromoText = 'promo text'
  const createAccountBlock = {
    fieldCtaSummaryText: 'summary text',
    fieldPrimaryCtaButtonText: 'button text',
    fieldRelatedInfoLinks: [
      {
        title: 'link title',
        url: {
          path: 'https://va.gov',
        },
      },
    ],
  }
  return (
    <>
      {fieldPromoHeadline && fieldPromoCta && (
        <div className="homepage-hero__wrapper" data-e2e="hero">
          <div className="vads-l-grid-container vads-u-padding-x--0 homepage-hero">
            <div className="vads-l-row">
              <div className="vads-l-col--12 medium-screen:vads-l-col--6">
                <div
                  className="vads-u-padding-left--2 vads-u-padding-right--3 vads-u-padding-top--5
                    vads-u-padding-bottom--3
                    desktop:vads-u-padding-bottom--8"
                >
                  <h1 className="homepage-hero__welcome-headline vads-u-color--white vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-y--1 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-font-size--lg vads-u-font-family--serif">
                    Welcome to VA.gov
                  </h1>
                  <h2 className="vads-u-color--white vads-u-margin-top--3 vads-u-font-size--xl desktop:vads-u-font-size--2xl">
                    {fieldPromoHeadline}
                  </h2>
                  {fieldPromoText && (
                    <p
                      id="myva-login--hero"
                      className="vads-u-color--white vads-u-padding-right--5"
                    >
                      {fieldPromoText}
                    </p>
                  )}
                  {fieldPromoCta.entity.fieldButtonLabel &&
                    fieldPromoCta.entity.fieldButtonLink.url.path && (
                      <va-link-action
                        type="reverse"
                        href={fieldPromoCta.entity.fieldButtonLink.url.path}
                        text={fieldPromoCta.entity.fieldButtonLabel}
                      ></va-link-action>
                    )}
                </div>
              </div>

              <div className="vads-l-col--12 medium-screen:vads-l-col--6 homepage-hero__container">
                <div className="vads-u-display--flex vads-u-width--full vads-u-align-items--center vars-u-justify-content--center">
                  <div className="va-flex vads-u-flex-direction--column vads-u-align-items--flex-start vads-u-background-color--white vads-u-margin-top--6 vads-u-margin-bottom--6 vads-u-padding-x--3 vads-u-padding-y--2 vads-u-width--full homepage-hero__create-account">
                    <h2 className="vads-u-font-size--md vads-u-line-height--5 vads-u-color--gray vads-u-margin-top--0 vads-u-padding-right--2 vads-u-font-family--sans vads-u-font-weight--normal">
                      {createAccountBlock.fieldCtaSummaryText}
                    </h2>
                    <va-button
                      className="vads-u-margin-bottom--3"
                      text={createAccountBlock.fieldPrimaryCtaButtonText}
                      onclick="openLoginModal()"
                    ></va-button>
                    {createAccountBlock.fieldRelatedInfoLinks.map(
                      (link, index) => (
                        <va-link
                          key={index}
                          href={link.url.path}
                          text={link.title}
                        ></va-link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!fieldPromoHeadline && !fieldPromoCta && (
        <div className="homepage-hero__wrapper fallback" data-e2e="hero">
          <div className="vads-l-grid-container vads-u-padding-x--0 homepage-hero">
            <div className="vads-l-row vads-u-display--flex vads-u-flex-wrap--nowrap">
              <div className="vads-u-padding-right--3 homepage-hero-first-column">
                <h1 className="homepage-hero__welcome-headline vads-u-color--white vads-u-padding-y--1 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-font-size--lg vads-u-font-family--serif">
                  Welcome to VA.gov
                </h1>
                <div className="homepage-hero__create-account vads-u-display--none">
                  <h2 className="vads-u-color--white vads-u-font-size--lg desktop:vads-u-font-size--xl">
                    Access and manage your VA benefits and health care
                  </h2>
                  <va-link
                    reverse
                    className="vads-u-display--block vads-u-font-weight--normal"
                    href="/resources/creating-an-account-for-vagov/"
                    text="Learn how an account helps you"
                  ></va-link>
                  <va-button
                    className="vads-u-margin-top--2"
                    onclick="openLoginModal()"
                    text="Create an account"
                    secondary
                  ></va-button>
                </div>
              </div>
              <div className="homepage-hero-second-column">
                <div className="veteran-portraits vads-u-display--flex vads-u-width--full vads-u-margin-left--0">
                  <img style={{ backgroundColor: '#0071BB' }} alt="" />
                  <img style={{ backgroundColor: '#005EA2' }} alt="" />
                  <img style={{ backgroundColor: '#003E73' }} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

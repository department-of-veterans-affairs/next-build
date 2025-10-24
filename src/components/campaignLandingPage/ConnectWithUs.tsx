import { placeholders } from './placeholders.temp'

export const ConnectWithUs = () => {
  // TODO: jsonToObj filter - need helper function to parse JSON
  const socialLinksObject = JSON.parse(
    placeholders.fieldConnectWithUs.entity.fieldSocialMediaLinks.platformValues
  )

  return (
    placeholders.fieldConnectWithUs.entity.fieldExternalLink.title && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              Connect with us
            </p>
            <h2 className="vads-u-margin-top--0">
              Get updates from{' '}
              {placeholders.fieldConnectWithUs.entity.fieldExternalLink.title}
            </h2>
          </div>
        </div>

        <div className="vads-l-row medium-screen:vads-u-margin-x--neg1">
          {placeholders.fieldConnectWithUs.entity.fieldEmailUpdatesLink.url
            .path &&
            placeholders.fieldConnectWithUs.entity.fieldEmailUpdatesLink
              .title && (
              <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                  <va-icon
                    icon="mail"
                    size="3"
                    className="vads-u-color--link-default vads-u-padding-right--1"
                  ></va-icon>
                  <va-link
                    href={
                      placeholders.fieldConnectWithUs.entity
                        .fieldEmailUpdatesLink.url.path
                    }
                    text={
                      placeholders.fieldConnectWithUs.entity
                        .fieldEmailUpdatesLink.title
                    }
                  />
                </div>
              </div>
            )}

          {socialLinksObject.twitter?.value && (
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                <va-icon
                  icon="x"
                  size="3"
                  className="vads-u-color--link-default vads-u-padding-right--1"
                ></va-icon>
                <va-link
                  href={`https://twitter.com/${socialLinksObject.twitter.value}`}
                  text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} X (formerly Twitter)`}
                />
              </div>
            </div>
          )}

          {socialLinksObject.facebook?.value && (
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                <va-icon
                  icon="facebook"
                  size="3"
                  className="vads-u-color--link-default vads-u-padding-right--1"
                ></va-icon>
                <va-link
                  href={`https://facebook.com/${socialLinksObject.facebook.value}`}
                  text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} Facebook`}
                />
              </div>
            </div>
          )}

          {socialLinksObject.youtube?.value && (
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                <va-icon
                  icon="youtube"
                  size="3"
                  className="vads-u-color--link-default vads-u-padding-right--1"
                ></va-icon>
                <va-link
                  href={`https://youtube.com/${socialLinksObject.youtube.value}`}
                  text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} YouTube`}
                />
              </div>
            </div>
          )}

          {socialLinksObject.linkedin?.value && (
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                <va-icon
                  icon="linkedin"
                  size="3"
                  className="vads-u-color--link-default vads-u-padding-right--1"
                ></va-icon>
                <va-link
                  href={`https://linkedin.com/${socialLinksObject.linkedin.value}`}
                  text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} LinkedIn`}
                />
              </div>
            </div>
          )}

          {socialLinksObject.instagram?.value && (
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                <va-icon
                  icon="instagram"
                  size="3"
                  className="vads-u-color--link-default vads-u-padding-right--1"
                ></va-icon>
                <va-link
                  href={`https://instagram.com/${socialLinksObject.instagram.value}`}
                  text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} Instagram`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  )
}

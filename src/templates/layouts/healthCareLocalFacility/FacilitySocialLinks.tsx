import React from 'react'

interface SocialLink {
  uri: string
  title: string
}

interface OperatingStatus {
  url: string
}

export interface FacilitySocialLinksProps {
  regionNickname: string
  fieldGovdeliveryIdEmerg?: string
  fieldGovdeliveryIdNews?: string
  fieldOperatingStatus?: OperatingStatus
  fieldFacebook?: SocialLink
  fieldTwitter?: SocialLink
  fieldFlickr?: SocialLink
  fieldInstagram?: SocialLink
  fieldYoutube?: SocialLink
}

const FacilitySocialLinks = ({
  regionNickname,
  fieldGovdeliveryIdEmerg,
  fieldGovdeliveryIdNews,
  fieldOperatingStatus,
  fieldFacebook,
  fieldTwitter,
  fieldFlickr,
  fieldInstagram,
  fieldYoutube,
}: FacilitySocialLinksProps) => {
  const showGovDelivery =
    !!fieldGovdeliveryIdEmerg ||
    !!fieldGovdeliveryIdNews ||
    !!fieldOperatingStatus

  const showSocialLinks =
    !!fieldFacebook ||
    !!fieldTwitter ||
    !!fieldFlickr ||
    !!fieldInstagram ||
    !!fieldYoutube

  if (!showGovDelivery && !showSocialLinks) {
    return null
  }

  return (
    <section
      data-template="facilities/facility_social_links"
      className="feature vads-u-background-color--gray-lightest vads-u-margin-top--4 mobile-lg:vads-u-margin-top--6 vads-u-padding-x--3 vads-u-padding-y--2p5"
    >
      <h2 id="get-updates" className="vads-u-margin-bottom--2">
        Get updates from {regionNickname}
      </h2>
      <div className="vads-grid-container vads-grid-row">
        {showGovDelivery && (
          <div className="vads-grid-col-6">
            {fieldGovdeliveryIdNews && (
              <div className="vads-u-margin-bottom--2">
                <va-icon
                  icon="mail"
                  size="3"
                  class="vads-u-color--link-default vads-u-margin-right--0p5"
                />
                <va-link
                  href={`https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=${fieldGovdeliveryIdNews}`}
                  rel="noreferrer"
                  text={`Subscribe to ${regionNickname} news and announcements`}
                />
              </div>
            )}
            {fieldGovdeliveryIdEmerg && (
              <div className="vads-u-margin-bottom--2">
                <va-icon
                  icon="mail"
                  size="3"
                  class="vads-u-color--link-default vads-u-margin-right--0p5"
                />
                <va-link
                  href={`https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=${fieldGovdeliveryIdEmerg}`}
                  rel="noreferrer"
                  text={`Subscribe to ${regionNickname} emergency notifications`}
                />
              </div>
            )}
            {fieldOperatingStatus?.url && (
              <div className="vads-u-margin-bottom--2">
                <va-icon
                  icon="adjust"
                  size="3"
                  class="vads-u-color--link-default vads-u-margin-right--0p5"
                />
                <va-link
                  href={fieldOperatingStatus.url}
                  text={`${regionNickname} operating status`}
                />
              </div>
            )}
          </div>
        )}

        {showSocialLinks && (
          <div className="vads-grid-col-6">
            <div>
              {fieldFacebook && (
                <div className="social-links vads-u-margin-bottom--2">
                  <va-icon
                    size="3"
                    icon="facebook"
                    class="vads-u-color--link-default vads-u-margin-right--0p5"
                  />
                  <va-link
                    href={fieldFacebook.uri}
                    rel="noreferrer"
                    text={fieldFacebook.title}
                  />
                </div>
              )}
              {fieldTwitter && (
                <div className="social-links vads-u-margin-bottom--2">
                  <va-icon
                    size="3"
                    icon="x"
                    class="vads-u-color--link-default vads-u-margin-right--0p5"
                  />
                  <va-link
                    href={fieldTwitter.uri}
                    rel="noreferrer"
                    text={fieldTwitter.title}
                  />
                </div>
              )}
              {fieldFlickr && (
                <div className="social-links vads-u-margin-bottom--2">
                  <va-icon
                    size="3"
                    icon="flickr"
                    class="vads-u-color--link-default vads-u-margin-right--0p5"
                  />
                  <va-link
                    href={fieldFlickr.uri}
                    rel="noreferrer"
                    text={fieldFlickr.title}
                  />
                </div>
              )}
              {fieldInstagram && (
                <div className="social-links vads-u-margin-bottom--2">
                  <va-icon
                    size="3"
                    icon="instagram"
                    class="vads-u-color--link-default vads-u-margin-right--0p5"
                  />
                  <va-link
                    href={fieldInstagram.uri}
                    rel="noreferrer"
                    text={fieldInstagram.title}
                  />
                </div>
              )}
              {fieldYoutube && (
                <div className="social-links vads-u-margin-bottom--2">
                  <va-icon
                    size="3"
                    icon="youtube"
                    class="vads-u-color--link-default vads-u-margin-right--0p5"
                  />
                  <va-link
                    href={fieldYoutube.uri}
                    rel="noreferrer"
                    text={fieldYoutube.title}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default FacilitySocialLinks

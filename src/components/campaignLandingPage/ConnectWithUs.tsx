import { CampaignLandingPageProps } from './template'

const SocialMediaLink = ({
  icon,
  href,
  text,
}: {
  icon: string
  href: string
  text: string
}) => {
  return (
    <div className="vads-grid-col-4">
      <div className="vads-u-margin-y--1 tablet:vads-u-margin-x--1">
        <va-icon
          icon={icon}
          size="3"
          className="vads-u-color--link-default vads-u-padding-right--1"
        />
        &nbsp;
        <va-link href={href} text={text} />
      </div>
    </div>
  )
}

export const ConnectWithUs = ({ connectWithUs }: CampaignLandingPageProps) => {
  if (!connectWithUs || !connectWithUs.organizationTitle) {
    return null
  }

  const { organizationTitle, emailLink, socialLinks } = connectWithUs

  return (
    <div
      className="vads-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
      data-testid="connect-with-us"
    >
      <div className="vads-grid-row">
        <div className="vads-grid-col-9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            Connect with us
          </p>
          <h2 className="vads-u-margin-top--0">
            {`Get updates from ${organizationTitle}`}
          </h2>
        </div>
      </div>

      <div className="vads-grid-row tablet:vads-u-margin-x--neg1">
        {emailLink?.href && emailLink?.title && (
          <SocialMediaLink
            icon="mail"
            href={emailLink.href}
            text={emailLink.title}
          />
        )}

        {socialLinks.twitter && (
          <SocialMediaLink
            icon="x"
            href={`https://www.twitter.com/${socialLinks.twitter}`}
            text={`${organizationTitle} X (formerly Twitter)`}
          />
        )}

        {socialLinks.facebook && (
          <SocialMediaLink
            icon="facebook"
            href={`https://www.facebook.com/${socialLinks.facebook}`}
            text={`${organizationTitle} Facebook`}
          />
        )}

        {socialLinks.youtube && (
          <SocialMediaLink
            icon="youtube"
            href={`https://www.youtube.com/${socialLinks.youtube}`}
            text={`${organizationTitle} YouTube`}
          />
        )}

        {socialLinks.linkedin && (
          <SocialMediaLink
            icon="linkedin"
            href={`https://www.linkedin.com/${socialLinks.linkedin}`}
            text={`${organizationTitle} LinkedIn`}
          />
        )}

        {socialLinks.instagram && (
          <SocialMediaLink
            icon="instagram"
            href={`https://www.instagram.com/${socialLinks.instagram}`}
            text={`${organizationTitle} Instagram`}
          />
        )}
      </div>
    </div>
  )
}

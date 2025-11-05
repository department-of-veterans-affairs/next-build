import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'

type ConnectWithUsProps = {
  connectWithUs: FormattedBenefitsHub['connectWithUs']
}
export function ConnectWithUsPanel({ connectWithUs }: ConnectWithUsProps) {
  const socialLinksObject =
    connectWithUs.field_social_media_links.platform_values
  return (
    <va-accordion-item open bordered header="Connect with us" level="2">
      <h3 className="vads-u-font-size--h4">Get updates</h3>
      {connectWithUs.field_email_updates_link.url &&
        connectWithUs.field_email_updates_link.title && (
          <div>
            <va-icon
              icon="mail"
              size="3"
              className="vads-u-color--link-default vads-u-padding-right--1"
            ></va-icon>
            <va-link
              href={connectWithUs.field_email_updates_link.url}
              text={connectWithUs.field_email_updates_link.title}
            />
          </div>
        )}
      <h3 className="vads-u-font-size--h4">Follow us</h3>
      <ul className="va-nav-linkslist-list social">
        {socialLinksObject.twitter?.value && (
          <li>
            <va-icon
              icon="x"
              size="3"
              className="vads-u-color--link-default vads-u-padding-right--1"
            ></va-icon>
            <va-link
              href={`https://twitter.com/${socialLinksObject.twitter.value}`}
              text={'Veterans Affairs X (formerly Twitter)'}
            />
          </li>
        )}

        {socialLinksObject.facebook?.value && (
          <li>
            <va-icon
              icon="facebook"
              size="3"
              className="vads-u-color--link-default vads-u-padding-right--1"
            ></va-icon>
            <va-link
              href={`https://facebook.com/${socialLinksObject.facebook.value}`}
              text={'Veterans Affairs Facebook'}
            />
          </li>
        )}

        {socialLinksObject.youtube?.value && (
          <li>
            <va-icon
              icon="youtube"
              size="3"
              className="vads-u-color--link-default vads-u-padding-right--1"
            ></va-icon>
            <va-link
              href={`https://youtube.com/${socialLinksObject.youtube.value}`}
              text={'Veterans Affairs YouTube'}
            />
          </li>
        )}

        {socialLinksObject.linkedin?.value && (
          <li>
            <va-icon
              icon="linkedin"
              size="3"
              className="vads-u-color--link-default vads-u-padding-right--1"
            ></va-icon>
            <va-link
              href={`https://linkedin.com/${socialLinksObject.linkedin.value}`}
              text={'Veterans Affairs LinkedIn'}
            />
          </li>
        )}

        {socialLinksObject.instagram?.value && (
          <li>
            <va-icon
              icon="instagram"
              size="3"
              className="vads-u-color--link-default vads-u-padding-right--1"
            ></va-icon>
            <va-link
              href={`https://instagram.com/${socialLinksObject.instagram.value}`}
              text={'Veterans Affairs Instagram'}
            />
          </li>
        )}
      </ul>
    </va-accordion-item>
  )
}

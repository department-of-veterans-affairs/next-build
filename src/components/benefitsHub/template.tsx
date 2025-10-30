import { getHubIcon } from '@/lib/utils/benefitsHub'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ContentFooter } from '@/components/contentFooter/template'

export function BenefitsHub({
  title,
  titleIcon,
  intro,
  spokes,
  lastUpdated,
  connectWithUs,
}: FormattedBenefitsHub) {
  const iconConfig = getHubIcon(titleIcon)
  const socialLinksObject =
    connectWithUs.field_social_media_links.platform_values || null

  return (
    <div className="usa-grid usa-grid-full">
      <article className="usa-width-two-thirds">
        {iconConfig ? (
          <div className="tablet:vads-u-display--flex vads-u-margin-y--1 vads-u-align-items--flex-start">
            <span className="vads-u-margin-top--1">
              <va-icon
                icon={iconConfig.icon}
                size="3"
                class={iconConfig.className}
              />
            </span>
            <h1 className="vads-u-margin-top--1 tablet:vads-u-margin-left--1 tablet:vads-u-margin-y--0">
              {title}
            </h1>
          </div>
        ) : (
          <h1>{title}</h1>
        )}
        {intro && (
          <p
            className="va-introtext"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        )}
        {spokes?.map((spokeSection) => (
          <div key={spokeSection.id}>
            <section className="usa-grid">
              <div className="va-h-ruled--stars"></div>
            </section>
            <ListOfLinkTeasers {...spokeSection} isHubPage={true} />
          </div>
        ))}
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
      <div className="usa-width-one-third vads-u-padding-right--2 vads-u-padding-bottom--2 mobile:vads-u-padding-left--2">
        <va-accordion uswds bordered>
          <va-accordion-item open header="Connect with us">
            <h3>Get updates</h3>
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
            <h3>Follow us</h3>
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
        </va-accordion>
      </div>
    </div>
  )
}

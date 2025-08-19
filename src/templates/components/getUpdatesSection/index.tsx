import { iconNameFromUrl, SocialLink } from '@/lib/utils/social'

type GetUpdatesSectionProps = {
  links: SocialLink[]
  heading: string
  sectionId: string
}

export const GetUpdatesSection = ({
  heading,
  links,
  sectionId,
}: GetUpdatesSectionProps) => (
  <section className="vads-u-background-color--gray-lightest vads-u-margin-top--4 mobile-lg:vads-u-margin-top--6 vads-u-padding-x--3 vads-u-padding-top--2p5 vads-u-padding-bottom--0p5">
    <h2 id={sectionId} className="vads-u-margin-bottom--2 vads-u-margin-top--0">
      {heading}
    </h2>
    <div className="vads-grid-row vads-u-flex-wrap--wrap">
      {links.map((link, index) => {
        const icon = link.icon || iconNameFromUrl(link.href)
        return (
          <p
            key={index}
            className="tablet:vads-grid-col-6 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2 vads-u-margin-top--0"
          >
            {icon && (
              <va-icon
                icon={icon}
                size="3"
                class="vads-u-color--link-default vads-u-margin-right--1"
              />
            )}
            <va-link href={link.href} text={link.text} />
          </p>
        )
      })}
    </div>
  </section>
)

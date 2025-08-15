import { slugifyString } from '@/lib/utils/slug'

type GetUpdatesSectionProps = {
  links: {
    label: string
    url: string
    type: string | null
  }[]
  heading: string
  sectionId: string
}

export const GetUpdatesSection = ({
  heading,
  links,
  sectionId,
}: GetUpdatesSectionProps) => (
  <section className="vads-u-background-color--gray-lightest vads-u-margin-top--4 mobile-lg:vads-u-margin-top--6 vads-u-padding-x--3 vads-u-padding-y--2p5">
    <h2 id={sectionId} className="vads-u-margin-bottom--2 vads-u-margin-top--0">
      {heading}
    </h2>
    <div className="vads-grid-row vads-u-flex-wrap--wrap">
      {links.map((link, index) => (
        <p
          key={index}
          className="tablet:vads-grid-col-6 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2 vads-u-margin-top--0"
        >
          {link.type && (
            <va-icon
              icon={link.type}
              size="3"
              class="vads-u-color--link-default vads-u-margin-right--1"
              data-testid={`icon-${link.type}`}
            />
          )}
          <va-link
            href={link.url}
            text={link.label}
            data-testid={`link-${slugifyString(link.label)}`}
          />
        </p>
      ))}
    </div>
  </section>
)

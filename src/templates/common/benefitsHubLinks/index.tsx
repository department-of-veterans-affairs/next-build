import { recordEvent } from '@/lib/analytics/recordEvent'
import { BenefitsHubLinks as FormattedBenefitsHubLinks } from '@/types/formatted/benefitsHub'

export function BenefitsHubLinks({
  title,
  introText,
  links,
}: FormattedBenefitsHubLinks) {
  return (
    <section className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">{title}</h2>
      {introText && <p>{introText}</p>}

      <ul className="usa-unstyled-list" role="list">
        {links.map((link) => {
          return (
            <li className="vads-u-margin-y--2" key={link.id}>
              <p className="vads-u-margin--0">
                <strong>
                  <a
                    onClick={() =>
                      recordEvent({
                        event: 'nav-linkslist',
                        'links-list-header': link.label,
                        'links-list-section-header': title,
                      })
                    }
                    href={link.path}
                  >
                    {link.label}
                  </a>
                </strong>
              </p>
              <p className="vads-u-margin--0">{link.teaserText}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

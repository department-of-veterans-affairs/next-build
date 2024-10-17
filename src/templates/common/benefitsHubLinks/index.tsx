import { recordEvent } from '@/lib/analytics/recordEvent'
import { BenefitsHubLinks as FormattedBenefitsHubLinks } from '@/types/formatted/benefitsHub'

// Used for R&S pages; group of links to benefit hubs under a "VA benefits" header
export function BenefitsHubLinks({
  links
}: FormattedBenefitsHubLinks) {
  let link
  const renderLink = (path, label, teaserText) => (
    <>
      <p className="vads-u-margin--0">
        <strong>
          <va-link
            href={path}
            text={label}
          />
        </strong>
      </p>
      <p className="vads-u-margin--0">{teaserText}</p>
    </>
  )

  if (links.length === 1) {
    link = links[0]
  }

  return (
    <section
      className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column"
      data-next-component="templates/common/benefitsHubLinks"
    >
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">VA benefits</h2>

      {links.length > 1 && (
        <ul className="usa-unstyled-list">
          {links.map(link => (
            <li className="vads-u-margin-y--2" key={link.id}>
              {renderLink(link.path, link.label, link.teaserText)}
            </li>
          ))}
        </ul>
      )}

      {links.length === 1 && renderLink(link.path, link.label, link.teaserText)}
    </section>
  )
}

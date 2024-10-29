import { isEmpty } from 'lodash'
import { FormattedRelatedLinks } from '@/types/formatted/relatedLinks'

// General component used for one or more links with a line of descriptive text underneath
// Does not map directly to any one Drupal type; it is simply a shared UI component
export const RelatedLinks = ({
  links,
  sectionTitle,
}: FormattedRelatedLinks): JSX.Element => {
  if (isEmpty(links)) {
    return null
  }

  let link
  const renderLink = (uri, title, summary) => (
    <>
      <p className="vads-u-margin--0">
        <strong>
          <va-link href={uri} text={title} />
        </strong>
      </p>
      <p className="vads-u-margin--0">{summary}</p>
    </>
  )

  if (links.length === 1) {
    link = links[0]
  }

  return (
    <section
      className="vads-u-margin-bottom--3 vads-u-display--flex vads-u-flex-direction--column"
      data-next-component="templates/common/RelatedLinks"
    >
      {sectionTitle && (
        <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">
          {sectionTitle}
        </h2>
      )}

      {links.length > 1 && (
        <ul className="usa-unstyled-list">
          {links.map((link, index) => (
            <li className="vads-u-margin-y--2" key={index}>
              {renderLink(link.uri, link.title, link.summary)}
            </li>
          ))}
        </ul>
      )}

      {links.length === 1 && renderLink(link.uri, link.title, link.summary)}
    </section>
  )
}

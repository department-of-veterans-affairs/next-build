import { isEmpty } from 'lodash'
import { FormattedRelatedLinks } from '@/types/formatted/relatedLinks'

export const RelatedLinks = ({
  links,
  sectionTitle,
}: FormattedRelatedLinks): JSX.Element => {
  if (isEmpty(links)) {
    return null
  }

  const renderLink = (uri: string, title: string, summary?: string) => (
    <>
      <p className="vads-u-margin--0">
        <strong>
          <va-link href={uri} text={title} />
        </strong>
      </p>
      {summary && <p className="vads-u-margin--0">{summary}</p>}
    </>
  )

  return (
    <section className="vads-u-margin-bottom--3 vads-u-display--flex vads-u-flex-direction--column">
      {sectionTitle && (
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--h3">
          {sectionTitle}
        </h2>
      )}

      {links.length > 1 && (
        <ul className="usa-unstyled-list">
          {links.map((link, index) => (
            <li className="vads-u-margin-bottom--2" key={index}>
              {renderLink(link.uri, link.title, link?.summary)}
            </li>
          ))}
        </ul>
      )}

      {links.length === 1 &&
        renderLink(links[0].uri, links[0].title, links[0].summary)}
    </section>
  )
}

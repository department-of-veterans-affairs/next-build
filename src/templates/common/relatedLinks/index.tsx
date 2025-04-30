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
        <va-link href={uri} text={title} />
      </p>
      {summary && <p className="vads-u-margin--0">{summary}</p>}
    </>
  )

  return (
    <section className="vads-u-background-color--gray-lightest vads-u-padding--2p5">
      {sectionTitle && (
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--h3 vads-u-padding-bottom--0p5 vads-u-border-bottom--1px vads-u-border-color--gray-light">
          {sectionTitle}
        </h2>
      )}

      {links.length > 1 && (
        <ul className="usa-unstyled-list">
          {links.map((link, index) => (
            <li
              className={
                index < links.length - 1 ? 'vads-u-margin-bottom--2' : ''
              }
              key={index}
            >
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

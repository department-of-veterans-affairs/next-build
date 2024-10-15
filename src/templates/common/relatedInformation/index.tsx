import { isEmpty } from 'lodash'
import { LinkTeaser } from '@/types/formatted/linkTeaser'

// Used for R&S pages; group of links under a "Related information" header
export const RelatedInformation = ({
  relatedInformation
}: LinkTeaser[]): JSX.Element => {
  const renderLink = (uri, title, summary) => (
    <>
      <p className="vads-u-margin--0">
        <strong>
          <va-link
            href={uri}
            text={title}
          />
        </strong>
      </p>
      <p className="vads-u-margin--0">{summary}</p>
    </>
  )

  return (
    <section className="vads-u-padding-top--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">Related information</h2>

      {relatedInformation?.length > 1 && (
        <ul className="usa-unstyled-list">
        {relatedInformation.map(link => (
          <li className="vads-u-margin-y--2" key={link.id}>
            {renderLink(link.uri, link.title, link.summary)}
          </li>
        ))}
        </ul>
      )}

      {relatedInformation.length === 1 && renderLink(link.uri, link.title, link.summary)}
    </section>
  )
}

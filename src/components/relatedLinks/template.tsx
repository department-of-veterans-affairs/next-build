import { isEmpty } from 'lodash'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { LinkTeaser } from '../linkTeaser/formatted-type'

const MAX_SHOWN_LINKS = 8

/**
 * Right now this is only used on the VAMC System and VAMC Facility pages as their own
 * special way of displaying related links. Note that link summaries are not shown.
 */
export const RelatedLinks = ({
  linkTeasers,
  title,
}: ListOfLinkTeasers): React.JSX.Element => {
  if (isEmpty(linkTeasers)) {
    return null
  }

  const renderLink = (link: LinkTeaser) => (
    <>
      <p className="vads-u-margin--0">
        <va-link
          disable-analytics
          onClick={() =>
            recordEvent({
              event: 'nav-featured-content-link-click',
              'featured-content-header': title,
              'featured-content-click-label': link.title,
            })
          }
          href={link.uri}
          text={link.title}
        />
      </p>
    </>
  )

  return (
    <section className="vads-u-background-color--gray-lightest vads-u-padding--2p5">
      {title && (
        <h2
          id="related-links"
          className="vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--h3 vads-u-padding-bottom--0p5 vads-u-border-bottom--1px vads-u-border-color--gray-light"
        >
          {title}
        </h2>
      )}

      {linkTeasers.length > 1 && (
        <ul className="usa-unstyled-list">
          {linkTeasers.slice(0, MAX_SHOWN_LINKS).map((link, index) => (
            <li
              className={
                index < linkTeasers.length - 1 ? 'vads-u-margin-bottom--2' : ''
              }
              key={index}
            >
              {renderLink(link)}
            </li>
          ))}
        </ul>
      )}

      {linkTeasers.length === 1 && renderLink(linkTeasers[0])}
    </section>
  )
}

import { ParagraphLinkTeaser } from '@/types/paragraph'
import { get } from 'lodash'

function isRequestValid(paragraph: ParagraphLinkTeaser) {
  return paragraph.field_link?.uri
}

const LinkTeaser = ({ paragraph, boldTitle, sectionHeader }): JSX.Element => {
  if (!paragraph || !isRequestValid(paragraph)) return

  const isFieldSpokes = paragraph.parent_field_name === 'field_spokes'
  const fieldLinkOption = get(paragraph.field_link.options, ['target'], '')

  if (isFieldSpokes || boldTitle) {
    return (
      <li key={paragraph.id} className="hub-page-link-list__item">
        <a
          href={paragraph.field_link?.uri}
          className="vads-u-text-decoration--underline"
          target={fieldLinkOption}
        >
          {paragraph.field_link?.title !== '' && (
            <>
              {isFieldSpokes ? (
                <>
                  <span className="hub-page-link-list__header">
                    {paragraph.field_link?.title}
                  </span>
                  <img
                    className="all-link-arrow"
                    src="/img/arrow-right-blue.svg"
                    alt="right-arrow"
                  ></img>
                </>
              ) : (
                <b>{paragraph.field_link?.title}</b>
              )}
            </>
          )}
        </a>
        <p className="va-nav-linkslist-description">
          {paragraph.field_link_summary}
        </p>
      </li>
    )
  }

  return (
    <li key={paragraph.id}>
      {paragraph.field_link.title !== '' && (
        <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
          <a
            href={paragraph.field_link?.uri}
            className="vads-u-text-decoration--underline"
            target={fieldLinkOption}
          >
            {paragraph.field_link?.title}
          </a>
        </h3>
      )}
      <p className="va-nav-linkslist-description">
        {paragraph.field_link_summary}
      </p>
    </li>
  )
}

export default LinkTeaser

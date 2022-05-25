import Image from '@/components/image'
import { get } from 'lodash'
import { ParagraphLinkTeaser } from '@/types/paragraph'
import { recordEvent } from '@/utils/recordEvent'
import { DEV_PATH } from '@/lib/constants'

function isRequestValid(paragraph: ParagraphLinkTeaser) {
  return paragraph.field_link?.uri
}

const LinkTeaser = ({ paragraph, boldTitle, sectionHeader }): JSX.Element => {
  if (!paragraph || !isRequestValid(paragraph)) return

  const analytic = {
    event: 'nav-linkslist',
    'links-list-header': encodeURIComponent(paragraph.field_link?.title),
    'links-list-section-header': encodeURIComponent(sectionHeader),
  }

  const isFieldSpokes = paragraph.parent_field_name === 'field_spokes'
  const fieldLinkOption = get(paragraph.field_link.options, ['target'], '')
  const thumbnail = DEV_PATH + '/img/arrow-right-blue.svg'

  if (isFieldSpokes || boldTitle) {
    return (
      <li
        key={paragraph.id}
        className="hub-page-link-list__item"
        onClick={() => recordEvent(analytic)}
      >
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
                  <Image
                    className="all-link-arrow"
                    src={thumbnail}
                    alt="right-arrow"
                    width="15px"
                    height="15px"
                  ></Image>
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
    <li key={paragraph.id} onClick={() => recordEvent(analytic)}>
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

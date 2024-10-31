import Image from 'next/image'
import { get } from 'lodash'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { LinkTeaser as FormattedLinkTeaser } from '@/types/formatted/linkTeaser'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export const LinkTeaser = ({
  id,
  title,
  summary,
  uri,
  parentField,
  componentParams,
  options,
}: ParagraphComponent<FormattedLinkTeaser>) => {
  const { boldTitle, sectionHeader } = componentParams

  const analytic = {
    event: 'nav-linkslist',
    'links-list-header': encodeURIComponent(title),
    'links-list-section-header': encodeURIComponent(sectionHeader),
  }

  const isFieldSpokes = parentField === 'field_spokes'
  const fieldLinkOption = get(options, ['target'], '')

  if (isFieldSpokes || boldTitle) {
    return (
      <li
        key={id}
        className="hub-page-link-list__item"
        onClick={() => recordEvent(analytic)}
      >
        <a
          href={uri}
          className="vads-u-text-decoration--underline"
          target={fieldLinkOption}
        >
          {title !== '' && (
            <>
              {isFieldSpokes ? (
                <>
                  <span className="hub-page-link-list__header">{title}</span>
                  <Image
                    id={id}
                    className="all-link-arrow"
                    src="/img/arrow-right-blue.svg"
                    alt="right-arrow"
                    width={15}
                    height={15}
                    title="right-arrow"
                  ></Image>
                </>
              ) : (
                <strong>{title}</strong>
              )}
            </>
          )}
        </a>
        <p className="va-nav-linkslist-description">{summary}</p>
      </li>
    )
  }

  return (
    <li key={id} onClick={() => recordEvent(analytic)}>
      {title !== '' && (
        <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
          <a
            href={uri}
            className="vads-u-text-decoration--underline"
            target={fieldLinkOption}
          >
            {title}
          </a>
        </h3>
      )}
      <p className="va-nav-linkslist-description">{summary}</p>
    </li>
  )
}

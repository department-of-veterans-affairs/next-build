import Image from 'templates/common/image'
import { get } from 'lodash'
import { recordEvent } from '@/lib/utils/recordEvent'
import { IMAGE_PATH_TEMP } from '@/lib/constants'

export const thumbnail = IMAGE_PATH_TEMP + '/img/arrow-right-blue.svg'

export interface LinkTeaserProps {
  id: string
  title: string
  summary: string
  uri: string
  parentField: string
  options: [string[]]
  componentParams: {
    boldTitle: boolean
    sectionHeader: string
  }
}

export const LinkTeaser = ({
  id,
  title,
  summary,
  uri,
  parentField,
  componentParams,
  options,
}: LinkTeaserProps) => {
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
                    className="all-link-arrow"
                    src={thumbnail}
                    alt="right-arrow"
                    width="15px"
                    height="15px"
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

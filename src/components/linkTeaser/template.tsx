import { get } from 'lodash'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { LinkTeaser as FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import clsx from 'clsx'

type LinkTeaserProps = ParagraphComponent<FormattedLinkTeaser> & {
  isHubPage?: boolean
}

export const LinkTeaser = ({
  id,
  title,
  summary,
  uri,
  isHubPage,
  options,
  sectionHeader,
}: LinkTeaserProps & { sectionHeader?: string }) => {
  const handleItemClick = () => {
    recordEvent({
      event: 'nav-linkslist',
      'links-list-header': encodeURIComponent(title),
      'links-list-section-header': encodeURIComponent(sectionHeader ?? ''),
    })
  }

  const target = get(options, ['target'], '')

  return (
    <li
      key={id}
      className={clsx(
        'vads-u-margin-y--2',
        isHubPage && 'hub-page-link-list__item'
      )}
      onClick={handleItemClick}
      data-template="paragraphs/linkTeaser"
      data-entity-id={id}
      data-links-list-header={title}
      data-links-list-section-header={sectionHeader}
    >
      {isHubPage ? (
        <>
          <span className="hub-page-link-list__header">
            <va-link
              href={uri}
              target={target}
              text={title}
              active=""
            ></va-link>
          </span>
          {summary && (
            <p
              className="va-nav-linkslist-description"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
        </>
      ) : (
        <>
          <p className="vads-u-margin--0 vads-u-font-weight--bold">
            <va-link href={uri} target={target} text={title}></va-link>
          </p>
          {summary && (
            <p
              className="vads-u-margin--0"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
        </>
      )}
    </li>
  )
}

import { get } from 'lodash'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { LinkTeaser as FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import clsx from 'clsx'

export const LinkTeaser = ({
  id,
  title,
  summary,
  uri,
  parentField,
  componentParams,
  options,
}: ParagraphComponent<FormattedLinkTeaser>) => {
  const { sectionHeader } = componentParams

  const handleItemClick = () => {
    recordEvent({
      event: 'nav-linkslist',
      'links-list-header': encodeURIComponent(title),
      'links-list-section-header': encodeURIComponent(sectionHeader),
    })
  }

  const isFieldSpokes = parentField === 'field_spokes'
  const target = get(options, ['target'], '')

  return (
    <li
      key={id}
      className={clsx(
        'vads-u-margin-y--2',
        isFieldSpokes && 'hub-page-link-list__item'
      )}
      onClick={handleItemClick}
    >
      <p className="vads-u-margin--0 vads-u-font-weight--bold">
        <va-link
          href={uri}
          target={target}
          text={title}
          active={isFieldSpokes}
        ></va-link>
      </p>
      <p className="vads-u-margin--0">{summary}</p>
    </li>
  )
}

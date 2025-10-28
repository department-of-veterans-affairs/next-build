import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
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
        <VaLink
          href={uri}
          // @ts-expect-error - This isn't supported by the web component, but I know
          // this template is under active development, so I'm not going to mess with
          // it right now. We might need to use a regular anchor here if we need to
          // support the target attribute.
          target={target}
          text={title}
          active={isFieldSpokes}
        ></VaLink>
      </p>
      <p className="vads-u-margin--0">{summary}</p>
    </li>
  )
}

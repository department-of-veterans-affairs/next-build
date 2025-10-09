import { get } from 'lodash'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { LinkTeaser as FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import clsx from 'clsx'

type LinkTeaserProps =
  | ParagraphComponent<FormattedLinkTeaser>
  | (ParagraphLinkTeaser & {
      parentField?: string
      componentParams?: { sectionHeader: string }
    })

export const LinkTeaser = (props: LinkTeaserProps) => {
  // Handle both formatted and raw Drupal data
  const isFieldSpokeData = 'field_link' in props
  const componentParams = props.componentParams || { sectionHeader: '' }
  const { sectionHeader } = componentParams

  // Extract properties based on data type with proper type assertions
  const id = props.id
  const parentField = props.parentField || null

  let title: string,
    summary: string,
    uri: string,
    options: { [key: string]: unknown }

  if (isFieldSpokeData) {
    const rawProps = props as ParagraphLinkTeaser & {
      parentField?: string
      componentParams?: { sectionHeader: string }
    }
    title = rawProps.field_link?.title || ''
    summary = rawProps.field_link_summary || ''
    uri = rawProps.field_link?.uri || ''
    options = rawProps.field_link?.options || {}
  } else {
    const formattedProps = props as ParagraphComponent<FormattedLinkTeaser>
    title = formattedProps.title || ''
    summary = formattedProps.summary || ''
    uri = formattedProps.uri || ''
    options = formattedProps.options || {}
  }

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
      data-template="paragraphs/linkTeaser"
      data-entity-id={id}
      data-links-list-header={title}
      data-links-list-section-header={sectionHeader}
    >
      {isFieldSpokes ? (
        <>
          <span className="hub-page-link-list__header">
            <va-link
              href={uri}
              target={target}
              text={title}
              active=""
            ></va-link>
          </span>
          {summary && <p className="va-nav-linkslist-description">{summary}</p>}
        </>
      ) : (
        <>
          <p className="vads-u-margin--0 vads-u-font-weight--bold">
            <va-link href={uri} target={target} text={title}></va-link>
          </p>
          <p className="vads-u-margin--0">{summary}</p>
        </>
      )}
    </li>
  )
}

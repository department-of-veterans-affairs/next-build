import {
  CollapsiblePanel as FormattedCollapsiblePanel,
  CollapsiblePanelItem as FormattedCollapsiblePanelItem,
} from '@/components/collapsiblePanel/formatted-type'
import { HeadingElement } from '@/components/heading/template'
import { WysiwygField } from '@/components/wysiwyg/template'
import { Paragraph } from '@/components/paragraph/template'
import { escape } from '@/lib/utils/helpers'
import { slugifyString } from '@/lib/utils/slug'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { conditionalAttr } from '@/lib/utils/helpers'
import { WithHeadingLevel } from '@/components/heading/formatted-type'

export const CollapsiblePanelItem = ({
  id,
  entityId,
  title,
  wysiwyg,
  headingLevel = 'h4',
  paragraphs = [],
}: ParagraphComponent<FormattedCollapsiblePanelItem> & WithHeadingLevel) => {
  return (
    <va-accordion-item
      key={entityId}
      class="va-accordion-item"
      id={`${slugifyString(title, 60)}-${id}`}
    >
      <HeadingElement headingLevel={headingLevel} slot="headline">
        {title}
      </HeadingElement>

      <div
        id={id}
        data-template="paragraphs/collapsible_panel__panel"
        data-paragraph-type="paragraph--collapsible_panel_item"
        data-entity-id={entityId}
        data-analytics-faq-text={escape(title)}
      >
        <div id={`collapsible_panel_item-${entityId}`}>
          <WysiwygField html={wysiwyg} />

          {paragraphs.map((paragraph) => {
            return <Paragraph key={paragraph.id} {...paragraph} />
          })}
        </div>
      </div>
    </va-accordion-item>
  )
}

export const CollapsiblePanel = ({
  id,
  entityId,
  paragraphs,
  bordered = false,
  headingLevel = 'h4',
}: ParagraphComponent<FormattedCollapsiblePanel> & WithHeadingLevel) => {
  return (
    <div
      id={id}
      data-template="paragraphs/collapsible_panel"
      data-paragraph-type="paragraph--collapsible_panel"
      data-entity-id={entityId}
    >
      <va-accordion {...conditionalAttr(bordered, 'bordered')}>
        {paragraphs.map((collapsiblePanelItem) => {
          // These paragraphs will always be `paragraph--collapsible_panel_item
          return (
            <CollapsiblePanelItem
              key={collapsiblePanelItem.id}
              {...collapsiblePanelItem}
              headingLevel={headingLevel}
            />
          )
        })}
      </va-accordion>
    </div>
  )
}

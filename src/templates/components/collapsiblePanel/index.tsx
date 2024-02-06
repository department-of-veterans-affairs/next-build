import {
  CollapsiblePanel as FormattedCollapsiblePanel,
  CollapsiblePanelItem as FormattedCollapsiblePanelItem,
} from '@/types/formatted/collapsiblePanel'
import { HeadingElement } from '@/templates/common/heading'
import { WysiwygField } from '@/templates/components/wysiwyg'
import { Paragraph } from '@/templates/components/paragraph'
import { escape } from '@/lib/utils/helpers'
import { slugifyString } from '@/lib/utils/slug'
import { ParagraphComponent } from '@/types/formatted/paragraph'
import { conditionalAttr } from '@/lib/utils/helpers'

export const CollapsiblePanelItem = ({
  id,
  entityId,
  title,
  wysiwyg,
  headingLevel = 'h4',
  expanded = false,
  paragraphs = [],
}: ParagraphComponent<FormattedCollapsiblePanelItem>) => {
  return (
    <va-accordion-item
      key={entityId}
      class="va-accordion-item"
      id={`${slugifyString(title, 60)}-${id}`}
      {...conditionalAttr(expanded, 'open', true)}
    >
      <HeadingElement headingLevel={headingLevel} slot="headline">
        {title}
      </HeadingElement>

      <div
        id={id}
        data-template="paragraphs/collapsible_panel__panel"
        data-paragraph="paragraph--collapsible_panel_item"
        data-next-component="templates/components/collapsiblePanel/(CollapsiblePanelItem)"
        data-entity-id={entityId}
        data-analytics-faq-text={escape(title)}
      >
        <div id={`collapsible_panel_item-${entityId}`}>
          <WysiwygField html={wysiwyg} />

          {paragraphs.map((paragraph, index) => {
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
  startExpanded = false,
  multiSelect = true,
  headingLevel = 'h4',
}: ParagraphComponent<FormattedCollapsiblePanel>) => {
  return (
    <div
      id={id}
      data-template="paragraphs/collapsible_panel"
      data-paragraph="paragraph--collapsible_panel"
      data-next-component="templates/components/collapsiblePanel/(CollapsiblePanel)"
      data-entity-id={entityId}
      data-multiselectable={multiSelect}
    >
      <va-accordion
        {...conditionalAttr(bordered, 'bordered')}
        {...conditionalAttr(!multiSelect, 'open-single')}
      >
        {paragraphs.map((collapsiblePanelItem, index) => {
          // These paragraphs will always be `paragraph--collapsible_panel_item
          return (
            <CollapsiblePanelItem
              key={collapsiblePanelItem.id}
              {...collapsiblePanelItem}
              expanded={startExpanded && index == 0 ? true : false}
              headingLevel={headingLevel}
            />
          )
        })}
      </va-accordion>
    </div>
  )
}

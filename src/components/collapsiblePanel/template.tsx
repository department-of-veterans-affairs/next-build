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
import { WithCurrentHeadingLevel } from '@/components/heading/formatted-type'
import { incrementHeadingLevel } from '../heading/incrementHeadingLevel'

export const CollapsiblePanelItem = ({
  id,
  entityId,
  title,
  wysiwyg,
  currentHeadingLevel = 'h3',
  paragraphs = [],
}: ParagraphComponent<FormattedCollapsiblePanelItem> &
  WithCurrentHeadingLevel) => {
  const headingLevel = incrementHeadingLevel(currentHeadingLevel)
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
            return (
              <Paragraph
                key={paragraph.id}
                {...paragraph}
                currentHeadingLevel={headingLevel}
              />
            )
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
  currentHeadingLevel = 'h3',
}: ParagraphComponent<FormattedCollapsiblePanel> & WithCurrentHeadingLevel) => {
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
              currentHeadingLevel={currentHeadingLevel}
            />
          )
        })}
      </va-accordion>
    </div>
  )
}

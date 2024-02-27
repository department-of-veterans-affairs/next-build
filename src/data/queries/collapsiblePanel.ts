import { ParagraphCollapsiblePanel } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { CollapsiblePanel } from '@/types/formatted/collapsiblePanel'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const formatter: QueryFormatter<
  ParagraphCollapsiblePanel,
  CollapsiblePanel
> = (entity: ParagraphCollapsiblePanel) => {
  return {
    type: entity.type as CollapsiblePanel['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    paragraphs: entity.field_va_paragraphs?.map?.(
      formatParagraph<'paragraph--collapsible_panel_item'>
    ),
    bordered: entity.field_collapsible_panel_bordered,
    startExpanded: entity.field_collapsible_panel_expand,
    multiSelect: entity.field_collapsible_panel_multi,
  }
}

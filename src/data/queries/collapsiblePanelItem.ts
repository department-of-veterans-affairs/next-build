import { ParagraphCollapsiblePanelItem } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { CollapsiblePanelItem } from '@/types/formatted/collapsiblePanel'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const formatter: QueryFormatter<
  ParagraphCollapsiblePanelItem,
  CollapsiblePanelItem
> = (entity: ParagraphCollapsiblePanelItem) => {
  return {
    type: entity.type as CollapsiblePanelItem['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    title: entity.field_title,
    wysiwyg: entity.field_wysiwyg?.processed,
    paragraphs: entity.field_va_paragraphs?.map?.(formatParagraph),
  }
}

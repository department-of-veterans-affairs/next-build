import { ParagraphCollapsiblePanelItem } from '@/types/drupal/paragraph'
import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { CollapsiblePanelItem } from '@/types/formatted/collapsiblePanel'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching paragraph--collapsible_panel_item.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_va_paragraphs'])
}

export const formatter: QueryFormatter<
  ParagraphCollapsiblePanelItem,
  CollapsiblePanelItem
> = (entity: ParagraphCollapsiblePanelItem) => {
  return {
    type: entity.type as CollapsiblePanelItem['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    title: entity.field_title,
    wysiwyg: entity.field_wysiwyg?.processed || null,
    paragraphs: entity.field_va_paragraphs?.map?.(formatParagraph),
  }
}

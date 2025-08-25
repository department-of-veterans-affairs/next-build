import { ParagraphCollapsiblePanel } from '@/types/drupal/paragraph'
import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { CollapsiblePanel } from '@/types/formatted/collapsiblePanel'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// Define the query params for fetching paragraph--collapsible_panel.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes(
      'field_va_paragraphs',
      PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL_ITEM
    ),
  ])
}

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

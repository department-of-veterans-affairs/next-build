import { QueryFormatter } from 'next-drupal-query'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import { LinkTeaser } from '@/types/formatted/linkTeaser'

export const formatter: QueryFormatter<ParagraphLinkTeaser, LinkTeaser> = (
  entity: ParagraphLinkTeaser
) => {
  return {
    type: entity.type as LinkTeaser['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    uri: entity.field_link?.uri,
    title: entity.field_link?.title,
    options: entity.field_link?.options,
    summary: entity.field_link_summary,
    parentField: entity.parent_field_name,
    componentParams: { boldTitle: false, sectionHeader: '' },
  }
}

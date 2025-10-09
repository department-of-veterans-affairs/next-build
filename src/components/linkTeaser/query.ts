import { QueryFormatter } from 'next-drupal-query'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import { FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'

export const formatter: QueryFormatter<
  ParagraphLinkTeaser,
  FormattedLinkTeaser | null
> = (entity: ParagraphLinkTeaser) => {
  if (!entity || !entity.field_link) return null
  return {
    type: entity.type as FormattedLinkTeaser['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id ?? null,
    uri: entity.field_link?.uri,
    title: entity.field_link?.title,
    options: entity.field_link?.options,
    summary: entity.field_link_summary,
    parentField: entity.parent_field_name ?? null,
    componentParams: { sectionHeader: '' },
  }
}

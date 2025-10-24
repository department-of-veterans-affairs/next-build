import { QueryFormatter } from 'next-drupal-query'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import { LinkTeaser } from '@/components/linkTeaser/formatted-type'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'

export const formatter: QueryFormatter<
  ParagraphLinkTeaser,
  LinkTeaser | null
> = (entity: ParagraphLinkTeaser) => {
  if (!entity || !entity.field_link) return null
  return {
    type: entity.type as LinkTeaser['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id ?? null,
    uri: entity.field_link?.url || entity.field_link?.uri,
    title: entity.field_link?.title,
    options: entity.field_link?.options,
    summary: entity.field_link_summary,
  }
}

import { QueryFormatter } from 'next-drupal-query'
import { ParagraphFeaturedContent } from '@/types/drupal/paragraph'
import { FeaturedContent } from '@/types/formatted/featuredContent'
import { queries } from '.'

export const formatter: QueryFormatter<
  ParagraphFeaturedContent,
  FeaturedContent
> = (entity: ParagraphFeaturedContent) => {
  if (!entity) return null
  return {
    type: entity.type as FeaturedContent['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    title: entity.field_section_header,
    description: entity.field_description.processed || null,
    link: entity.field_cta
      ? queries.formatData('paragraph--button', entity.field_cta)
      : null,
  }
}

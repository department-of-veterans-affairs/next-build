import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphFeaturedContent } from '@/types/drupal/paragraph'
import { FeaturedContent } from '@/components/featuredContent/formatted-type'
import { formatter as formatButton } from '@/components/button/query'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_cta'])
}

export const formatter: QueryFormatter<
  ParagraphFeaturedContent,
  FeaturedContent
> = (entity: ParagraphFeaturedContent) => {
  if (!entity) return null
  return {
    type: entity.type as FeaturedContent['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id || null,
    title: entity.field_section_header,
    description: getHtmlFromField(entity.field_description) || null,
    link: entity.field_cta ? formatButton(entity.field_cta) : null,
  }
}

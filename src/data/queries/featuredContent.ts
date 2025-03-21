import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  CCFieldCta,
  ParagraphButton,
  ParagraphFeaturedContent,
} from '@/types/drupal/paragraph'
import { FeaturedContent } from '@/types/formatted/featuredContent'
import { queries } from '.'
import { ccCta } from '../processors/ccCta'

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
    description: entity.field_description.processed || null,
    // cc CTAs are arrays of non-paragraph types, so we need to format them differently
    link:
      (entity.field_cta as ParagraphButton)?.type === 'paragraph_button'
        ? queries.formatData(
            'paragraph--button',
            entity.field_cta as unknown as ParagraphButton
          )
        : ccCta(entity.field_cta as unknown as CCFieldCta[]),
  }
}

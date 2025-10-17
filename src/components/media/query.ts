import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphMedia } from '@/types/drupal/paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'
import { Media } from './formatted-type'
// import { queries } from '@/lib/drupal/queries'

export const params: QueryParams<null> = () =>
  new DrupalJsonApiParams().addInclude(
    getNestedIncludes('field_media', 'media--image')
  )

export const formatter: QueryFormatter<ParagraphMedia, Media | null> = (
  entity: ParagraphMedia
) => {
  if (!entity.field_media || !entity.field_media.image) return null
  return {
    type: entity.type as ParagraphMedia['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id ?? null,
    // image: queries.formatData('media--image', entity.field_media),
    image: {
      url: entity.field_media.image.uri.url,
      alt: entity.field_media.image.resourceIdObjMeta.alt,
      title: entity.field_media.image.resourceIdObjMeta.title,
    },
    allowClicksOnThisImage: entity.field_allow_clicks_on_this_image,
  }
}

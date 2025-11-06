import { QueryFormatter } from 'next-drupal-query'
import { LinkTeaserWithImage } from './formatted-type'
import { ParagraphLinkTeaserWithImage } from '@/types/drupal/paragraph'

import { formatter as teaserFormatter } from '../linkTeaser/query'
import { formatter as imageFormatter } from '../mediaImage/query'

export const formatter: QueryFormatter<
  ParagraphLinkTeaserWithImage,
  LinkTeaserWithImage
> = (entity: ParagraphLinkTeaserWithImage) => {
  if (!entity) return null
  return {
    id: entity.id,
    entityId: entity.drupal_internal__id ?? null,
    type: entity.type as LinkTeaserWithImage['type'],
    teaser: teaserFormatter(entity?.field_link_teaser ?? null),
    image: imageFormatter(entity?.field_media ?? null),
  }
}

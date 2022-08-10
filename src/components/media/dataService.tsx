import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { MediaImage, MediaResourceType } from '@/types/media'
import { ImageProps, MediaImageComponent } from '@/components/media'
import { absoluteURL } from '@/utils/helpers'

export const mediaImageDataService = function (
  entity: MediaImage
): ImageProps | null {
  if (!entity || !entity.image) return null

  return {
    url: absoluteURL(entity.image.uri?.url) || '',
    styles: entity.image.links || 'full_content_width',
    alt: entity.image.resourceIdObjMeta?.alt,
    title: entity.image.resourceIdObjMeta?.title,
    width: entity.image.resourceIdObjMeta?.width,
    height: entity.image.resourceIdObjMeta?.height,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams().addInclude(['image']).addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: MediaResourceType.Image,
  component: MediaImageComponent,
  dataService: mediaImageDataService,
  params: params,
}

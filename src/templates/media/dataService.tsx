import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from 'data/delegators/entityMetaProvider'
import { MediaImage, MediaResourceType } from '@/types/media'
import { MediaImageComponent, MediaImageProps } from 'templates/media'
import { absoluteURL } from '@/lib/utils/helpers'

export const mediaImageDataService = function (
  entity: MediaImage,
  imageStyle
): MediaImageProps | null {
  if (!entity || !entity.image) return null

  return {
    id: entity.image.id,
    url: absoluteURL(entity.image.uri?.url),
    styles: entity.image.links || entity.thumbnail.links,
    alt: entity.image.resourceIdObjMeta?.alt,
    title: entity.image.resourceIdObjMeta?.title,
    width: entity.image.resourceIdObjMeta?.width,
    height: entity.image.resourceIdObjMeta?.height,
    imageStyle: imageStyle,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude(['image', 'image.thumbnail'])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: MediaResourceType.Image,
  component: MediaImageComponent,
  dataService: mediaImageDataService,
  params: params,
}

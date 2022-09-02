import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { MediaImage } from '@/types/dataTypes/drupal/media'
import { drupalClient } from '@/lib/utils/drupalClient'
import { MediaImageType } from '@/types/index'

// Define query params for queryData.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['image'])
}
// Define the option types for the data loader.
type DataOpts = QueryOpts<null>

// Implement the data loader.
export const data: QueryData<
  DataOpts,
  MediaImage
> = async (): Promise<MediaImage> => {
  const entities = await drupalClient.getResourceCollection<MediaImage>(
    'media--image',
    {
      params: params().getQueryObject(),
    }
  )
  return entities
}

export const formatter: QueryFormatter<MediaImage, MediaImageType[]> = (
  entities: MediaImage
) => {
  if (!entities) return null
  const castArray = (val) => (Array.isArray(val) ? val : [val])
  const media = castArray(entities).map((entity) => ({
    id: entity.image.id,
    type: entity.type,
    link: entity.image?.links,
    alt: entity.image?.resourceIdObjMeta?.alt,
    width: entity.image?.resourceIdObjMeta?.width,
    height: entity.image?.resourceIdObjMeta?.height,
    title: entity.image?.resourceIdObjMeta?.title,
    url: entity.image?.uri?.url,
    highRes: entity.image?.resourceIdObjMeta?.highRes,
  }))
  return media
}

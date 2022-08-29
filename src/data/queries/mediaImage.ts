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
  return queries.getParams().addPageLimit(12).addInclude(['image'])
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

  // const mediaData = compactObject(entities)
  const castArray = (val) => (Array.isArray(val) ? val : [val])
  const media = castArray(entities).map((item) => {
    return {
      id: item.id,
      type: item.type,
      link: item.image?.links,
      alt: item.image?.resourceIdObjMeta?.alt,
      width: item.image?.resourceIdObjMeta?.width,
      height: item.image?.resourceIdObjMeta?.height,
      title: item.image?.resourceIdObjMeta?.title,
      url: item.image?.uri?.url,
    }
  })
  return media
}

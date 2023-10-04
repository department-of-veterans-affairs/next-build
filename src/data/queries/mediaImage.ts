import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { MediaImage } from '@/types/dataTypes/drupal/media'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { MediaImageType } from '@/types/index'

type MediaImageData = {
  entity: MediaImage
  cropType?: string
}

// Define query params for queryData.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['image'])
}
// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
  cropType?: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, MediaImageData> = async (
  opts
): Promise<MediaImageData> => {
  const entity = await drupalClient.getResource<MediaImage>(
    'media--image',
    opts.id,
    {
      params: params().getQueryObject(),
    }
  )

  return { entity, cropType: opts.cropType || '2_1_large' }
}

export const formatter: QueryFormatter<MediaImageData, MediaImageType> = ({
  entity,
  cropType = '2_1_large',
}) => {
  // TODO: may need more handling here around crop type + image height / width. TBD.
  return {
    id: entity.image.id,
    type: entity.type,
    link: entity.image?.links,
    alt: entity.image?.resourceIdObjMeta?.alt,
    width: entity.image?.resourceIdObjMeta?.width,
    height: entity.image?.resourceIdObjMeta?.height,
    title: entity.image?.resourceIdObjMeta?.title,
    url: entity.image.links[cropType].href,
  }
}

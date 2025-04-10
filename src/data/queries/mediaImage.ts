import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DrupalMediaImage } from '@/types/drupal/media'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { MediaImage } from '@/types/formatted/media'

// Define query params for queryData.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['image'])
}
// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
  cropType?: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, DrupalMediaImage> = async (
  opts
): Promise<DrupalMediaImage> => {
  const entity = await drupalClient.getResource<DrupalMediaImage>(
    'media--image',
    opts.id,
    {
      params: params().getQueryObject(),
    }
  )

  return entity
}

export const formatter: QueryFormatter<
  Omit<DrupalMediaImage, 'langcode'>,
  // DrupalMediaImage,
  MediaImage
> = (entity) => {
  if (!entity) return null
  return {
    id: entity.image.id,
    type: entity.type,
    links: entity.image?.links,
    alt: entity.image?.resourceIdObjMeta?.alt,
    width: entity.image?.resourceIdObjMeta?.width,
    height: entity.image?.resourceIdObjMeta?.height,
    title: entity.image?.resourceIdObjMeta?.title,
  }
}

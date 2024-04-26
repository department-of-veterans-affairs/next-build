import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { MediaVideo } from '@/types/formatted/media'
import { DrupalMediaVideo } from '@/types/drupal/media'
import { drupalClient } from '@/lib/drupal/drupalClient'

// Define the query params for fetching node--media_video.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['video'])
}

// Define the option types for the data loader.
export type DataOpts = {
  id: string
  context?: string
}

// Implement the data loader.
export const data: QueryData<DataOpts, DrupalMediaVideo> = async (
  opts
): Promise<DrupalMediaVideo> => {
 const entity = await drupalClient.getResource<DrupalMediaVideo>(
    'media--video',
    opts.id,
    {
      params: params().getQueryObject(),
    }
  )

  return entity
}

export const formatter: QueryFormatter<DrupalMediaVideo, MediaVideo> = (
  entity: DrupalMediaVideo
) => {
  if(!entity) return null
  return {
    id: entity.video.id,
    type: entity.type,
    links: entity.video?.links,
    alt: entity.video?.resourceIdObjMeta?.alt,
    width: entity.video?.resourceIdObjMeta?.width,
    height: entity.video?.resourceIdObjMeta?.height,
    title: entity.video?.resourceIdObjMeta?.title,
  }
}

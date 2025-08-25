import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { MediaVideo } from '@/types/formatted/media'
import { DrupalMediaVideo } from '@/types/drupal/media'
import { drupalClient } from '@/lib/drupal/drupalClient'

// Define the query params for fetching node--media_video.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([])
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
  if (!entity) return null
  return {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    field_description: entity?.field_description,
    field_duration: entity?.field_duration,
    field_media_video_embed_field: entity?.field_media_video_embed_field,
  }
}

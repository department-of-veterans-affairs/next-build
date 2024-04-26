import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { MediaDocument } from '@/types/formatted/media'
import { DrupalMediaDocument } from '@/types/drupal/media'

// Define the query params for fetching node--media_document.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['document'])
}

// Define the option types for the data loader.
export type DataOpts = {
  id: string
  context?: string
}

// Implement the data loader.
export const data: QueryData<DataOpts, DrupalMediaDocument> = async (
  opts
): Promise<DrupalMediaDocument> => {
const entity = await drupalClient.getResource<DrupalMediaDocument>(
    'media--document',
    opts.id,
    {
      params: params().getQueryObject(),
    }
  )

  return entity
}

export const formatter: QueryFormatter<DrupalMediaDocument, MediaDocument> = (
  entity: DrupalMediaDocument
) => {
  if (!entity) return null
  return {
    id: entity.document.id,
    type: entity.type,
    links: entity.document?.links,
    alt: entity.document?.resourceIdObjMeta?.alt,
    width: entity.document?.resourceIdObjMeta?.width,
    height: entity.document?.resourceIdObjMeta?.height,
    title: entity.document?.resourceIdObjMeta?.title,
  }
}

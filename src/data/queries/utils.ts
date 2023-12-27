import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { JsonApiResponse } from 'next-drupal'
import { ResourceType } from '@/lib/constants/resourceTypes'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeTypes } from '@/types/dataTypes/drupal/node'
import { PublishedEntity } from '@/types/dataTypes/formatted/publishedEntity'

type ResourceCollection<T> = {
  data: T[]
  totalItems: number
  totalPages: number
}

function addPagingParams(
  params: DrupalJsonApiParams,
  pageSize: number,
  pageNumber: number
): DrupalJsonApiParams {
  const paramsWithPageSize = params.addPageLimit(pageSize)
  return pageNumber
    ? paramsWithPageSize.addPageOffset((pageNumber - 1) * pageSize)
    : paramsWithPageSize
}

export async function fetchSingleResourceCollectionPage<T>(
  resourceType: ResourceType,
  params: DrupalJsonApiParams,
  pageSize: number,
  pageNumber: number
): Promise<ResourceCollection<T>> {
  const page = await drupalClient.getResourceCollection<JsonApiResponse>(
    resourceType,
    {
      params: addPagingParams(params, pageSize, pageNumber).getQueryObject(),
      deserialize: false, //`deserialize: false` for jsonapi pagination
    }
  )

  const data = drupalClient.deserialize(page) as T[]
  const totalItems = page.meta.count
  const totalPages = Math.ceil(totalItems / pageSize) || 0

  return {
    data,
    totalItems,
    totalPages,
  }
}

export async function fetchAndConcatAllResourceCollectionPages<T>(
  resourceType: ResourceType,
  params: DrupalJsonApiParams,
  pageSize: number
): Promise<ResourceCollection<T>> {
  // Fetch first page.
  const {
    data: firstPageData,
    totalItems,
    totalPages,
  } = await fetchSingleResourceCollectionPage<T>(
    resourceType,
    params,
    pageSize,
    1
  )

  // If more pages, fetch them in parallel.
  // Note: If we used JSON:API `next` links, we'd have to fetch in series.
  const subsequentPageData = await Promise.all(
    Array.from({
      length: totalPages - 1,
    }).map(async (_, i) => {
      const pageNumber = i + 2
      return (
        await fetchSingleResourceCollectionPage<T>(
          resourceType,
          params,
          pageSize,
          pageNumber
        )
      ).data
    })
  )

  // Glue all pages together.
  return {
    data: [firstPageData, ...subsequentPageData].flat(),
    totalItems,
    totalPages,
  }
}

// Helper function to return a consistent set of base fields for resources
export const entityBaseFields = (entity: NodeTypes): PublishedEntity => {
  return {
    id: entity.id,
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path.alias,
    type: entity.type,
    published: entity.status,
    moderationState: entity.moderation_state,
    title: entity.title,
    metatags: entity.metatag,
    breadcrumbs: entity.breadcrumbs,
  }
}

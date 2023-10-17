import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { JsonApiResponse } from 'next-drupal'
import { ResourceTypeType } from '@/lib/constants/resourceTypes'
import { drupalClient } from '@/lib/drupal/drupalClient'

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
  resourceType: ResourceTypeType,
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
  resourceType: ResourceTypeType,
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
    null
  )

  // If more pages, fetch them in parallel.
  // Note: If we used JSON:API `next` links, we'd have to fetch in series.
  const subsequentPageData = await Promise.all(
    Array.from({
      length: totalPages - 1,
    }).map((_, i) => {
      const pageNumber = i + 2
      return drupalClient.getResourceCollection<T[]>(resourceType, {
        params: addPagingParams(params, pageSize, pageNumber).getQueryObject(),
      })
    })
  )

  // 4. Glue all pages together.
  return {
    data: [firstPageData, ...subsequentPageData].flat(),
    totalItems,
    totalPages,
  }
}

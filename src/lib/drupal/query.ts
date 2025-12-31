import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { JsonApiResponse } from 'next-drupal'
import { QueryParams } from 'next-drupal-query'
import { ResourceType } from '@/lib/constants/resourceTypes'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { Menu } from '@/types/drupal/menu'

// Module-level cache for menu and entity results
const memoryCache = new Map<string, object>()

export type ResourceCollection<T> = {
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

// Fetch drupal menu resource with cache.
export async function getMenu(
  name: string | number,
  params?: QueryParams<null>
): Promise<Menu> {
  const defaultMenuParams = new DrupalJsonApiParams()
    .addFields('menu_items', ['title,url'])
    .getQueryObject()

  const queryParams = params ? params().getQueryObject() : defaultMenuParams

  // Generate cache key including params to ensure different params produce different cached results
  const cacheKey = `menu:${name}:${JSON.stringify(queryParams)}`

  // Check memory cache first if enabled
  if (process.env.USE_MEMORY_CACHE === 'true') {
    const cachedMenu = memoryCache.get(cacheKey)
    if (cachedMenu) {
      return cachedMenu as Menu
    }
  }

  const menu = await drupalClient.getMenu('' + name, {
    params: queryParams,

    // Cache resource if redis is available (and memory cache is not enabled)
    withCache:
      process.env.USE_REDIS === 'true' &&
      process.env.USE_MEMORY_CACHE !== 'true',
    cacheKey: `menu:${name}`,
  })

  // Store in memory cache if enabled
  if (process.env.USE_MEMORY_CACHE === 'true') {
    // eslint-disable-next-line no-console
    console.log('🍄 setting menu in memory cache', cacheKey)
    memoryCache.set(cacheKey, menu)
  }

  return menu
}

// Consistent handler to fetch a node entity from a normal route or a preview route.
export async function fetchSingleEntityOrPreview(opts, type, params) {
  const queryParams = params().getQueryObject()
  const isPreview = opts?.context?.preview

  // Generate cache key including type, id, and params
  // Don't cache preview requests as they are for unpublished content
  const cacheKey = isPreview
    ? null
    : `entity:${type}:${opts.id}:${JSON.stringify(queryParams)}`

  // Check memory cache first if enabled and not in preview mode
  if (process.env.USE_MEMORY_CACHE === 'true' && cacheKey && opts.useCache) {
    const cachedEntity = memoryCache.get(cacheKey)
    if (cachedEntity) {
      return cachedEntity
    }
  }

  // Include cache options if useCache is true and redis is enabled (and memory cache is not enabled)
  const cacheOptions =
    opts.useCache && process.env.USE_MEMORY_CACHE !== 'true'
      ? {
          withCache: process.env.USE_REDIS === 'true',
          cacheKey: `entity:${type}:${opts.id}`,
        }
      : {}

  const entity = isPreview
    ? // need to use getResourceFromContext for unpublished revisions
      await drupalClient.getResourceFromContext(type, opts.context, {
        params: queryParams,
      })
    : // otherwise just lookup by uuid
      await drupalClient.getResource(type, opts.id, {
        params: queryParams,
        ...cacheOptions,
      })

  // Store in memory cache if enabled and not in preview mode
  if (process.env.USE_MEMORY_CACHE === 'true' && cacheKey && opts.useCache) {
    memoryCache.set(cacheKey, entity)
  }

  return entity
}

/**
 * Custom error class representing a "Do Not Publish" error.
 * Throw this error when a query encounters a condition
 * where publishing is not allowed or should be prevented.
 *
 * @extends {Error}
 */
export class DoNotPublishError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DoNotPublishError'
  }
}

import { GetStaticPropsContext } from 'next'
import { DrupalTranslatedPath } from 'next-drupal'
import { QueryOpts } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/data/queries'
import {
  LISTING_RESOURCE_TYPE_URL_SEGMENTS,
  ListingPageStaticPropsContextProps,
  ListingResourceTypeType,
  getListingPageStaticPropsContext,
} from './listingPages'
import {
  LOVELL,
  LovellStaticPropsContextProps,
  getLovellStaticPropsContext,
  LovellFormattedResource,
  LovellStaticPropsResource,
  LovellResourceType,
  isLovellBifurcatedResource,
  getLovellVariantOfUrl,
  getLovellChildVariantOfResource,
  LovellBifurcatedFormattedResource,
  LovellListingPageFormattedResource,
  getOppositeChildVariant,
} from './lovell'
import { FormattedResource } from '@/data/queries'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import { NewsStoryDataOpts } from '@/data/queries/newsStory'
import { PAGE_SIZES } from '../constants/pageSizes'

export type ExpandedStaticPropsContext = GetStaticPropsContext & {
  path: string
  drupalPath: string
  listing: ListingPageStaticPropsContextProps
  lovell: LovellStaticPropsContextProps
}

export type StaticPropsResource<T extends FormattedResource> =
  | T
  | LovellStaticPropsResource<LovellFormattedResource>

type StaticPropsQueryOpts =
  | NewsStoryDataOpts
  | ListingPageDataOpts
  | QueryOpts<{
      id: string
    }>

/**
 * Decorates the original context with expanded details:
 * - LISTING PAGES
 *   -Determines if the requested page is a listing page. If so:
 *     - Sets drupalPath to the actual drupal resource (path with page number stripped).
 *     - Determines the page number.
 * - LOVELL
 *   - Determines if the requested page is a Lovell page. If so:
 *     - Determines the variant (TRICARE/VA).
 *
 * @param context
 * @returns Original context with added props
 */
export function getExpandedStaticPropsContext(
  context: GetStaticPropsContext
): ExpandedStaticPropsContext {
  const path = drupalClient.getPathFromContext(context)
  const listing = getListingPageStaticPropsContext(context)
  const lovell = getLovellStaticPropsContext(context)

  return {
    ...context,
    path,
    drupalPath: listing.isListingPage ? listing.firstPagePath : path,
    listing,
    lovell,
  }
}

/**
 * Gets query options object used to fetch data for
 * generating static props
 *
 * @param resourceType
 * @param id
 * @param context
 * @returns A query options object whose shape is determined by the resource type
 */
export function getStaticPropsQueryOpts(
  resourceType: ResourceTypeType,
  id: string,
  context: ExpandedStaticPropsContext
): StaticPropsQueryOpts {
  if (resourceType === RESOURCE_TYPES.STORY) {
    return {
      id,
    }
  }

  if (resourceType === RESOURCE_TYPES.STORY_LISTING) {
    return {
      id,
      page: context.listing.page,
    }
  }

  return {
    id,
  }
}

export async function fetchSingleStaticPropsResource(
  resourceType: ResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  queryOpts: StaticPropsQueryOpts
): Promise<FormattedResource> {
  // Request resource based on type
  const resource = await queries.getData(resourceType, queryOpts)
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${pathInfo.jsonapi.individual}`)
  }
  return resource
}

export async function getDefaultStaticPropsResource(
  resourceType: ResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<FormattedResource> {
  // Set up query for resource at the given path
  const id = pathInfo.entity?.uuid
  const queryOpts = getStaticPropsQueryOpts(resourceType, id, context)
  return fetchSingleStaticPropsResource(resourceType, pathInfo, queryOpts)
}

export async function getLovellListingPageStaticPropsResource(
  resourceType: ListingResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<LovellStaticPropsResource<LovellListingPageFormattedResource>> {
  const id = pathInfo.entity?.uuid
  const childVariantPage = (await fetchSingleStaticPropsResource(
    resourceType,
    pathInfo,
    {
      id,
      // Do not pass a page number; we need all of the pages
      // so we can merge and then calculate page data
    }
  )) as LovellListingPageFormattedResource

  const federalPagePathInfo = await drupalClient.translatePath(
    getLovellVariantOfUrl(context.drupalPath, LOVELL.federal.variant)
  )
  if (!federalPagePathInfo) {
    return childVariantPage
  }
  const federalPageId = federalPagePathInfo.entity?.uuid
  const federalPage = (await fetchSingleStaticPropsResource(
    resourceType,
    federalPagePathInfo,
    {
      id: federalPageId,
      // Again, do not pass specific page number
    }
  )) as LovellListingPageFormattedResource

  const itemProp = LISTING_RESOURCE_TYPE_URL_SEGMENTS[resourceType]
  const allMergedItems = [
    ...childVariantPage[itemProp],
    ...federalPage[itemProp],
  ]
  const pageSize = PAGE_SIZES[resourceType]
  const sliceStart = (context.listing.page - 1) * pageSize
  const sliceEnd = sliceStart + pageSize
  const pagedMergedItems = allMergedItems.slice(sliceStart, sliceEnd)
  const totalItems = childVariantPage.totalItems + federalPage.totalItems
  const totalPages = Math.ceil(totalItems / pageSize) || 0

  return {
    ...childVariantPage,
    [itemProp]: pagedMergedItems,
    currentPage: context.listing.page,
    totalItems,
    totalPages,
    canonicalLink: childVariantPage.entityPath,
    lovellVariant: context.lovell.variant,
    lovellSwitchPath: getLovellVariantOfUrl(
      childVariantPage.entityPath,
      getOppositeChildVariant(context.lovell.variant)
    ),
  }
}

export async function getLovellStaticPropsResource(
  resourceType: LovellResourceType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<LovellStaticPropsResource<LovellFormattedResource>> {
  // Lovell listing pages need Federal items merged
  if (context.lovell.isLovellVariantPage && context.listing.isListingPage) {
    return getLovellListingPageStaticPropsResource(
      resourceType as ListingResourceTypeType,
      pathInfo,
      context
    )
  }

  // Other Lovell pages depend on base resource
  const baseResource = (await getDefaultStaticPropsResource(
    resourceType,
    pathInfo,
    context
  )) as LovellFormattedResource

  // Other: bifurcated pages
  if (isLovellBifurcatedResource(baseResource)) {
    return getLovellChildVariantOfResource(
      baseResource as LovellBifurcatedFormattedResource,
      context.lovell.variant
    )
  }

  // Other: no special treatment
  return baseResource
}

export async function getStaticPropsResource(
  resourceType: ResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<StaticPropsResource<FormattedResource>> {
  // Lovell (TRICARE or VA) pages
  if (context.lovell.isLovellVariantPage) {
    return getLovellStaticPropsResource(
      resourceType as LovellResourceType,
      pathInfo,
      context
    )
  }

  // All others
  return getDefaultStaticPropsResource(resourceType, pathInfo, context)
}

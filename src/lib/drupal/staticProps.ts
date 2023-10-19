import { GetStaticPropsContext } from 'next'
import { DrupalTranslatedPath } from 'next-drupal'
import { QueryOpts } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/data/queries'
import {
  ListingPageStaticPropsContextProps,
  getListingPageStaticPropsContext,
} from '@/lib/drupal/listingPages'
import {
  getLovellStaticPropsResource,
  getLovellStaticPropsContext,
} from '@/lib/drupal/lovell/staticProps'
import {
  LovellResourceType,
  LovellStaticPropsContextProps,
  LovellStaticPropsResource,
  LovellFormattedResource,
} from './lovell/types'
import { FormattedResource } from '@/data/queries'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import { NewsStoryDataOpts } from '@/data/queries/newsStory'

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

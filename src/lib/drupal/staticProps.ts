import { GetStaticPropsContext } from 'next'
import { DrupalTranslatedPath } from 'next-drupal'
import { drupalClient } from '@/lib/drupal/drupalClient'
import {
  FormattedPageResource,
  QueryablePageResourceType,
  queries,
  QUERIES_MAP,
} from '@/data/queries'
import {
  ListingPageStaticPropsContextProps,
  getListingPageStaticPropsContext,
  isListingResourceType,
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
import { ResourceType } from '@/lib/constants/resourceTypes'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import { NewsStoryDataOpts } from '@/data/queries/newsStory'

export type ExpandedStaticPropsContext = GetStaticPropsContext & {
  path: string
  drupalPath: string
  listing: ListingPageStaticPropsContextProps
  lovell: LovellStaticPropsContextProps
}

export type StaticPropsResource<T extends FormattedPageResource> =
  | T
  | LovellStaticPropsResource<LovellFormattedResource>

type StaticPropsQueryOpts = NewsStoryDataOpts | ListingPageDataOpts

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
  resourceType: ResourceType,
  id: string,
  context: ExpandedStaticPropsContext
): StaticPropsQueryOpts {
  // most types will simply need an ID, preview mode needs context
  const defaultQueryOpts = {
    id,
    context: context.preview ? context : null,
  }

  // Listing Page types need to know what page # to query for
  if (isListingResourceType(resourceType)) {
    return {
      ...defaultQueryOpts,
      page: context.listing.page,
    }
  }

  return defaultQueryOpts
}

export async function fetchSingleStaticPropsResource(
  resourceType: ResourceType,
  pathInfo: DrupalTranslatedPath,
  queryOpts: StaticPropsQueryOpts
): Promise<FormattedPageResource> {
  // Request resource based on type
  const resource = Object.keys(QUERIES_MAP).includes(resourceType)
    ? await queries.getData(
        resourceType as QueryablePageResourceType,
        queryOpts
      )
    : null
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${pathInfo.jsonapi.individual}`)
  }
  return resource
}

export async function getDefaultStaticPropsResource(
  resourceType: ResourceType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<FormattedPageResource> {
  // Set up query for resource at the given path
  const id = pathInfo.entity?.uuid
  const queryOpts = getStaticPropsQueryOpts(resourceType, id, context)
  return fetchSingleStaticPropsResource(resourceType, pathInfo, queryOpts)
}

export async function getStaticPropsResource(
  resourceType: ResourceType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<StaticPropsResource<FormattedPageResource>> {
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

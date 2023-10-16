import { GetStaticPropsContext } from 'next'
import { DrupalTranslatedPath } from 'next-drupal'
import { QueryOpts } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/data/queries'
import {
  ListingPageStaticPropsContextProps,
  getListingPageStaticPropsContext,
} from './listingPages'
import {
  LOVELL_RESOURCE_TYPES,
  LovellStaticPropsContextProps,
  getLovellStaticPropsContext,
  isLovellResourceType,
  LovellFormattedResource,
  LovellExpandedFormattedResource,
  getLovellExpandedFormattedResource,
} from './lovell'
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

export type ExpandedFormattedResource<T extends FormattedResource> =
  | T
  | LovellExpandedFormattedResource<LovellFormattedResource>

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
 * Decorates the original resource according to business logic:
 * - LOVELL:
 *   - If original resource is a Lovell page, adjust accordingly (see: getLovellPageStaticPropsResourceDetails)
 *
 * @param resource
 * @param context
 * @returns Original context conditionally adjusted according to business logic
 */
export function getExpandedFormattedResource(
  resource: FormattedResource,
  context: ExpandedStaticPropsContext
): ExpandedFormattedResource<typeof resource> {
  const isLovellPage =
    isLovellResourceType(resource.type as ResourceTypeType) &&
    context.lovell.isLovellVariantPage
  if (isLovellPage) {
    return getLovellExpandedFormattedResource(
      resource as LovellFormattedResource,
      context
    )
  }

  return resource
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
):
  | NewsStoryDataOpts
  | ListingPageDataOpts
  | QueryOpts<{
      id: string
    }> {
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

async function getDefaultStaticPropsResource(
  resourceType: ResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<ExpandedFormattedResource<FormattedResource>> {
  // Set up query for resource at the given path
  const id = pathInfo.entity?.uuid
  const queryOpts = getStaticPropsQueryOpts(resourceType, id, context)

  // Request resource based on type
  const resource = await queries.getData(resourceType, queryOpts)
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${pathInfo.jsonapi.individual}`)
  }

  return resource
}

// async function getLovellListingPageStaticPropsResource(
//   resourceType: ResourceTypeType,
//   pathInfo: DrupalTranslatedPath,
//   context: ExpandedStaticPropsContextType
// ): Promise<ExpandedFormattedResource<FormattedResource>> {

async function getLovellOtherPageStaticPropsResource(
  resourceType: ResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<ExpandedFormattedResource<FormattedResource>> {
  const baseResource = await getDefaultStaticPropsResource(
    resourceType,
    pathInfo,
    context
  )

  if (LOVELL_RESOURCE_TYPES.includes[baseResource.type]) {
    return getLovellExpandedFormattedResource(
      baseResource as LovellFormattedResource,
      context
    )
  }

  return baseResource
}

export async function getStaticPropsResource(
  resourceType: ResourceTypeType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<ExpandedFormattedResource<FormattedResource>> {
  // // Lovell (TRICARE or VA) listing pages
  // if (context.listing.isListingPage && context.lovell.isLovellVariantPage) {
  //   return getLovellListingPageStaticPropsResource(
  //     resourceType,
  //     pathInfo,
  //     context
  //   )
  // }

  // // Other Lovell (TRICARE or VA) pages
  // if (context.lovell.isLovellVariantPage) {
  //   return getLovellBifurcatedPageStaticPropsResource()
  // }

  // All others
  return getDefaultStaticPropsResource(resourceType, pathInfo, context)
}

import { GetStaticPropsContext } from 'next'
import { QueryOpts } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import {
  ListingPageExpandedStaticPropsContextType,
  getListingPageExpandedStaticPropsContext,
} from './listingPages'
import {
  LovellPageExpandedStaticPropsContextType,
  getLovellPageExpandedStaticPropsContext,
  getLovellPageExpandedStaticPropsResource,
  isLovellResourceType,
  LovellExpandedResourceTypeType,
  LovellResourceTypeType,
} from './lovell'
import { StaticPropsResourceType } from '@/types/index'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import { NewsStoryDataOpts } from '@/data/queries/newsStory'

export type ExpandedStaticPropsContextType = GetStaticPropsContext & {
  path: string
  drupalPath: string
  listing: ListingPageExpandedStaticPropsContextType
  lovell: LovellPageExpandedStaticPropsContextType
}

export type ExpandedStaticPropsResourceType<T extends StaticPropsResourceType> =
  T | LovellExpandedResourceTypeType<LovellResourceTypeType>

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
): ExpandedStaticPropsContextType {
  const path = drupalClient.getPathFromContext(context)
  const listing = getListingPageExpandedStaticPropsContext(context)
  const lovell = getLovellPageExpandedStaticPropsContext(context)

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
export function getExpandedStaticPropsResource(
  resource: StaticPropsResourceType,
  context: ExpandedStaticPropsContextType
): ExpandedStaticPropsResourceType<typeof resource> {
  const isLovellPage =
    isLovellResourceType(resource.type as ResourceTypeType) &&
    context.lovell.isLovellVariantPage
  if (isLovellPage) {
    return getLovellPageExpandedStaticPropsResource(
      resource as LovellResourceTypeType,
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
  context: ExpandedStaticPropsContextType
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

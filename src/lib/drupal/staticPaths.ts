import { drupalClient } from '@/lib/drupal/drupalClient'
import {
  ListingResourceType,
  getAllPagedListingStaticPathResources,
  isListingResourceType,
} from '@/lib/drupal/listingPages'
import { RESOURCE_TYPES, ResourceType } from '@/lib/constants/resourceTypes'
import { queries } from '@/data/queries'
import { StaticPathResource } from '@/types/dataTypes/formatted/staticPathResource'
import {
  bifurcateLovellFederalPathResources,
  removeLovellFederalPathResources,
} from '@/lib/drupal/lovell/staticPaths'

/**
 * Returns a static-path resource collection that is modified per business logic.
 * Resources are added, removed and/or edited.
 *
 * E.g.
 * - Resources are ADDED for subsequent listing pages (e.g. `stories/page-2`)
 * - Resources are ADDED for Lovell bifurcation (Federal pages become VA *and* TRICARE)
 * - Lovell Federal listing pages are REMOVED
 */
async function modifyStaticPathResourcesByResourceType(
  resourceType: ResourceType,
  resources: StaticPathResource[]
): Promise<StaticPathResource[]> {
  if (resourceType === RESOURCE_TYPES.STORY) {
    return bifurcateLovellFederalPathResources(resources)
  }

  if (isListingResourceType(resourceType)) {
    const lovellFederalRemoved = removeLovellFederalPathResources(resources)
    return await getAllPagedListingStaticPathResources(
      lovellFederalRemoved,
      resourceType as ListingResourceType
    )
  }

  return resources
}

export async function getStaticPathsByResourceType(
  resourceType: ResourceType
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  // Get resources from which static paths can be built
  const resources = await queries.getData('static-path-resources', {
    resourceType,
  })

  // Modifiy resources per business logic
  const modifiedResources = await modifyStaticPathResourcesByResourceType(
    resourceType,
    resources
  )

  // Convert the resources to static paths
  //  TODO: This should probably not use a Drupal-specific utility to work on post-formatted data.
  //  This is currently using a type assertion to make it possible since we know that the necessary
  //  props will be present, though they probably shouldn't be present because the formatted data
  //  prop names are a bit specific to drupal (e.g. `pid` on Path).
  const paths = drupalClient.buildStaticPathsFromResources(
    modifiedResources as Parameters<
      typeof drupalClient.buildStaticPathsFromResources
    >[0]
  )
  return paths
}

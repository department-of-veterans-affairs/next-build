import { drupalClient } from '@/lib/drupal/drupalClient'
import {
  ListingResourceType,
  getAllPagedListingStaticPathResources,
  isListingResourceType,
} from '@/lib/drupal/listingPages'
import { RESOURCE_TYPES, ResourceType } from '@/lib/constants/resourceTypes'
import { queries } from '@/data/queries'
import { StaticPathResourceType } from '@/types/index'
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
  resources: StaticPathResourceType[]
): Promise<StaticPathResourceType[]> {
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
  const paths = drupalClient.buildStaticPathsFromResources(modifiedResources)
  return paths
}

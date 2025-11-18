import { drupalClient } from '@/lib/drupal/drupalClient'
import { fetchSingleEntityOrPreview, getMenu } from '@/lib/drupal/query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Menu } from '@/types/drupal/menu'
import { SideNavMenuIcon } from '@/components/sideNav/formatted-type'
import { NodeLandingPage } from '@/types/drupal/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { getHubIcon } from '@/lib/utils/benefitsHub'

export const HUB_NAV_NAMES = [
  'burials-and-memorials-benef',
  'careers-employment-benefits',
  'decision-reviews-benefits-h',
  'disability-benefits-hub',
  'education-benefits-hub',
  'health-care-benefits-hub',
  'housing-assistance-benefits',
  'life-insurance-benefits-hub',
  'pension-benefits-hub',
  'records-benefits-hub',
  'root-benefits-hub',
  'family-and-caregiver-benefits',
]

interface BenefitsHubMenuResult {
  menu: Menu | null
  menuIcon: SideNavMenuIcon | null
}

const NULL_RESULT: BenefitsHubMenuResult = { menu: null, menuIcon: null }

// Module-level cache for benefits hub menu results
const cache = new Map<string, BenefitsHubMenuResult>()

/**
 * Fetches the benefits hub menu and icon for a given benefits detail page path.
 * Uses caching to avoid redundant API calls for the same benefits hub.
 *
 * @param detailPagePath - The full path alias of the benefits detail page (e.g., "/health-care/about-va-health-benefits")
 * @param administrationName - The administration name from field_administration (e.g., "Health Care")
 * @param context - Optional expanded static props context for preview support
 * @returns Object containing the menu and menuIcon, or null values if not found
 */
export async function getBenefitsHubMenu(
  detailPagePath: string,
  administrationName: string | null,
  context?: ExpandedStaticPropsContext
): Promise<BenefitsHubMenuResult> {
  if (!administrationName) {
    return NULL_RESULT
  }

  const benefitsHubName = administrationName
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/&/g, 'and')

  const menuName = HUB_NAV_NAMES.find((name) => benefitsHubName.includes(name))
  if (!menuName) {
    return NULL_RESULT
  }

  // Extract the first path segment (e.g., "/health-care" from "/health-care/about-va-health-benefits")
  const pathSegments = detailPagePath.split('/').filter(Boolean)
  if (pathSegments.length === 0) {
    return NULL_RESULT
  }

  const benefitsHubPath = `/${pathSegments[0]}`

  // Check cache first for the final result
  const cachedResult = cache.get(benefitsHubPath)
  if (cachedResult) {
    // eslint-disable-next-line no-console
    console.log('Used cache for benefits hub menu:', benefitsHubPath)
    return cachedResult
  }

  // Not in cache - fetch the benefits hub node
  const pathInfo = await drupalClient.translatePath(benefitsHubPath)

  if (!pathInfo?.entity?.uuid) {
    return NULL_RESULT
  }

  // Fetch the benefits hub entity
  const params = () => new DrupalJsonApiParams()

  const benefitsHubNode = (await fetchSingleEntityOrPreview(
    {
      id: pathInfo.entity.uuid,
      context,
    },
    RESOURCE_TYPES.BENEFITS_HUB,
    params
  )) as NodeLandingPage

  // If we don't have a benefits hub node, return null
  if (!benefitsHubNode) {
    return NULL_RESULT
  }

  // Fetch the menu
  const menu = await getMenu(menuName)

  // Extract the menuIcon from field_title_icon using the existing utility
  let menuIcon: SideNavMenuIcon | null = null
  if (benefitsHubNode.field_title_icon) {
    const hubIcon = getHubIcon(benefitsHubNode.field_title_icon)
    if (hubIcon) {
      menuIcon = {
        name: hubIcon.icon,
        backgroundColor: hubIcon.backgroundColor,
      }
    }
  }

  // Build the result
  const result: BenefitsHubMenuResult = { menu, menuIcon }

  // Cache the final result for future calls
  cache.set(benefitsHubPath, result)

  return result
}

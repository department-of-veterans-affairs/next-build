import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { QueryParams } from 'next-drupal-query'
import {
  NodeVhaFacilityNonclinicalService,
  NodeHealthCareLocalFacility,
} from '@/types/drupal/node'
import { VhaFacilityNonclinicalService } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { fetchAndConcatAllResourceCollectionPages } from '@/lib/drupal/query'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatServiceLocation } from '@/components/serviceLocation/query'

/**
 * Builds query parameters for fetching VHA facility nonclinical services
 * filtered by facility IDs and service name.
 */
export const params: QueryParams<{
  facilityIds: string[]
  serviceName: string
}> = ({ facilityIds, serviceName }) => {
  return new DrupalJsonApiParams()
    .addInclude([
      'field_facility_location',
      ...getNestedIncludes(
        'field_service_location',
        PARAGRAPH_RESOURCE_TYPES.SERVICE_LOCATION
      ),
    ])
    .addFilter('status', '1')
    .addFilter('field_service_name_and_descripti.name', serviceName)
    .addFilter('field_facility_location.id', facilityIds, 'IN')
    .addFilter('field_facility_location.status', '1')
}

/**
 * Fetches VHA facility nonclinical services for a given region page and service name.
 * Uses a two-step query approach to avoid slow nested relationship filters.
 *
 * @param vamcSystemId - The UUID of the VAMC system (health_care_region_page)
 * @param serviceName - The name of the service to filter by (e.g., 'Billing and insurance', 'Medical records', 'Register for care')
 * @returns Array of Drupal node entities
 */
export async function fetchVhaFacilityNonclinicalServices(
  vamcSystemId: string,
  serviceName: string
): Promise<NodeVhaFacilityNonclinicalService[]> {
  // Step 1: Fetch facilities for this region_page (direct filter - much faster)
  const { data: facilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addFilter('field_region_page.id', vamcSystemId),
      PAGE_SIZES.MAX
    )

  // If no facilities found, return empty array
  if (facilities.length === 0) {
    return []
  }

  // Step 2: Fetch services filtered by facility_location IDs (avoids nested relationship filter)
  // This replaces the slow nested filter: field_facility_location.field_region_page.id
  // with a direct filter on facility_location IDs, which should be much faster
  const facilityIds = facilities.map((f) => f.id)
  const { data: services } =
    await fetchAndConcatAllResourceCollectionPages<NodeVhaFacilityNonclinicalService>(
      RESOURCE_TYPES.VHA_FACILITY_NONCLINICAL_SERVICE,
      params({ facilityIds, serviceName }),
      PAGE_SIZES.MAX
    )

  return services
}

/**
 * Formats an array of NodeVhaFacilityNonclinicalService entities into
 * VhaFacilityNonclinicalService formatted objects.
 *
 * @param services - Array of Drupal node entities
 * @returns Array of formatted service objects, sorted alphabetically by title
 */
export const formatter = (
  services: NodeVhaFacilityNonclinicalService[]
): VhaFacilityNonclinicalService[] => {
  const formattedServices = services.map((service) => ({
    id: service.id,
    title: service.field_facility_location.title,
    path: service.field_facility_location.path.alias,
    serviceLocations: service.field_service_location.map(formatServiceLocation),
    address: service.field_facility_location.field_address,
    phoneNumber: service.field_facility_location.field_phone_number,
  }))

  // The old page didn't sort them, but we want the order to be predictable
  formattedServices.sort((a, b) => a.title.localeCompare(b.title))

  return formattedServices
}

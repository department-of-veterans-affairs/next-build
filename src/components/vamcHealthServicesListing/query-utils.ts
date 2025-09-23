import {
  NodeHealthCareLocalHealthService,
  NodeRegionalHealthCareServiceDes,
} from '@/types/drupal/node'
import {
  HealthService,
  HealthServiceGroup,
  HealthServiceLocation,
} from './formatted-type'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

const formatHealthServiceLocations = (
  localHealthCareServices: NodeHealthCareLocalHealthService[]
): HealthServiceLocation[] => {
  return localHealthCareServices
    .filter((service) => service.status && service.field_facility_location)
    .map((service) => ({
      id: service.drupal_internal__nid?.toString() || '',
      title: service.field_facility_location.title || '',
      path: service.field_facility_location.entity_url?.path || '',
      isMainLocation:
        service.field_facility_location.field_main_location || false,
      facilityClassification:
        service.field_facility_location.field_facility_classification || '',
      isMobile: service.field_facility_location.field_mobile || false,
    }))
    // The original orderFieldLocalHealthCareServices is actually way more complicated
    .sort((a, b) => {
      // Sort by main location first, then by title
      if (a.isMainLocation && !b.isMainLocation) return -1
      if (!a.isMainLocation && b.isMainLocation) return 1
      return a.title.localeCompare(b.title)
    })
}

export function formatHealthService(
  service: NodeRegionalHealthCareServiceDes,
  administration: any
): HealthService | null {
  const taxonomy = service.field_service_name_and_descripti
  if (!taxonomy) {
    // Sometimes these are null, and I think it means it was archived. - PW
    return null
  }

  const locations = formatHealthServiceLocations(
    service.field_local_health_care_service_ || []
  )

  const isLovellTricare = administration?.entityId === LOVELL.tricare.administration.entityId
  const descriptionHtml =
    isLovellTricare && taxonomy.field_tricare_description
      ? taxonomy.field_tricare_description
      : getHtmlFromField(taxonomy.description) || ''

  return {
    id: service.drupal_internal__nid?.toString() || '',
    title: taxonomy.name || '',
    alsoKnownAs: taxonomy.field_also_known_as || null,
    commonlyTreatedCondition:
      taxonomy.field_commonly_treated_condition || null,
    descriptionHtml,
    bodyHtml: getHtmlFromField(service.field_body),
    typeOfCare: taxonomy.field_service_type_of_care || '',
    locations,
  }
}

/**
 * Helper function to group health services by type of care
 */
export function groupHealthServicesByType(
  services: HealthService[]
): HealthServiceGroup[] {
  const groups: { [key: string]: HealthService[] } = {}

  services.forEach((service) => {
    const typeOfCare = service.typeOfCare || 'Other services'
    if (!groups[typeOfCare]) {
      groups[typeOfCare] = []
    }
    groups[typeOfCare].push(service)
  })

  // Sort services within each group by name
  Object.keys(groups).forEach((typeOfCare) => {
    groups[typeOfCare].sort((a, b) => a.title.localeCompare(b.title))
  })

  // Convert to array and sort by predefined order
  const typeOrder = [
    'Primary care',
    'Mental health care',
    'Specialty care',
    'Social programs and services',
    'Other services',
  ]

  return typeOrder
    .filter((type) => groups[type] && groups[type].length > 0)
    .map((typeOfCare) => ({
      typeOfCare,
      services: groups[typeOfCare],
    }))
}

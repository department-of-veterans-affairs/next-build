import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Administration } from '@/types/formatted/administration'

export const LOVELL = {
  /**
   * The "federal" variant isn't actually one of the variants, but it's used in Drupal to
   * house the bifurcated pages that we wish to define only once and generate copies of
   * for both TRICARE and VA. It is a "Section" (Administration) in Drupal that resources
   * can be assigned to.
   */
  federal: {
    title: 'Lovell Federal health care',
    administration: {
      entityId: 347,
      name: 'Lovell Federal health care',
    } as Administration,
    pathSegment: 'lovell-federal-health-care',
    variant: 'federal',
  },
  tricare: {
    title: 'Lovell Federal health care - TRICARE',
    administration: {
      entityId: 1039,
      name: 'Lovell - TRICARE',
    } as Administration,
    pathSegment: 'lovell-federal-health-care-tricare',
    variant: 'tricare',
  },
  va: {
    title: 'Lovell Federal health care - VA',
    administration: {
      entityId: 1040,
      name: 'Lovell - VA',
    } as Administration,
    pathSegment: 'lovell-federal-health-care-va',
    variant: 'va',
  },
} as const

export const LOVELL_RESOURCE_TYPES = [
  RESOURCE_TYPES.STORY,
  RESOURCE_TYPES.STORY_LISTING,
  RESOURCE_TYPES.EVENT,
  RESOURCE_TYPES.EVENT_LISTING,
  RESOURCE_TYPES.PRESS_RELEASE,
  RESOURCE_TYPES.PRESS_RELEASE_LISTING,
  RESOURCE_TYPES.STAFF_PROFILE,
  RESOURCE_TYPES.VAMC_SYSTEM,
  RESOURCE_TYPES.LEADERSHIP_LISTING,
  RESOURCE_TYPES.LOCATIONS_LISTING,
  RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING,
]

export const LOVELL_BIFURCATED_RESOURCE_TYPES = [
  RESOURCE_TYPES.STORY,
  RESOURCE_TYPES.EVENT,
  RESOURCE_TYPES.STAFF_PROFILE,
  RESOURCE_TYPES.PRESS_RELEASE,
  RESOURCE_TYPES.LOCATIONS_LISTING,
  RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING,
]

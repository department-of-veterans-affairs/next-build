import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Administration } from '@/data/queries/administration'

export const LOVELL = {
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
]

export const LOVELL_BIFURCATED_RESOURCE_TYPES = [
  RESOURCE_TYPES.STORY,
  RESOURCE_TYPES.EVENT,
  RESOURCE_TYPES.STAFF_PROFILE,
  RESOURCE_TYPES.PRESS_RELEASE,
]

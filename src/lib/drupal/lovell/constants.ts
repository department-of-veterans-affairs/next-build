import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const LOVELL = {
  federal: {
    title: 'Lovell Federal health care',
    administrationId: 347,
    pathSegment: 'lovell-federal-health-care',
    variant: 'federal',
  },
  tricare: {
    title: 'Lovell Federal health care - TRICARE',
    administrationId: 1039,
    pathSegment: 'lovell-federal-health-care-tricare',
    variant: 'tricare',
  },
  va: {
    title: 'Lovell Federal health care - VA',
    administrationId: 1040,
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

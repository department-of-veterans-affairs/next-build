import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const LOVELL = {
  federal: {
    administration: {
      id: 347,
      name: 'Lovell Federal health care',
    },
    pathSegment: 'lovell-federal-health-care',
    variant: 'federal',
  },
  tricare: {
    administration: {
      id: 1039,
      name: 'Lovell - TRICARE',
    },
    pathSegment: 'lovell-federal-health-care-tricare',
    variant: 'tricare',
  },
  va: {
    administration: {
      id: 1040,
      name: 'Lovell - VA',
    },
    pathSegment: 'lovell-federal-health-care-va',
    variant: 'va',
  },
} as const

export const LOVELL_RESOURCE_TYPES = [
  RESOURCE_TYPES.STORY,
  RESOURCE_TYPES.STORY_LISTING,
]

export const LOVELL_BIFURCATED_RESOURCE_TYPES = [RESOURCE_TYPES.STORY]

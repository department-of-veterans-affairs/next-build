import {
  RESOURCE_TYPES,
  ADDITIONAL_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'

export const PAGE_SIZES = {
  [RESOURCE_TYPES.STORY_LISTING]: 10,
  [ADDITIONAL_RESOURCE_TYPES.STATIC_PATHS]: 50, //must be <= 50 due to JSON:API limit
} as const

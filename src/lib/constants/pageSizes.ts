import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const PAGE_SIZES = {
  [RESOURCE_TYPES.STORY_LISTING]: 10,
  MAX: 50, //50 is JSON:API limit. Use this for fetching as many as possible at a time.
} as const

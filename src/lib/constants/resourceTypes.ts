export const RESOURCE_TYPES = {
  STORY_LISTING: 'node--story_listing',
  STORY: 'node--news_story',
  EVENT: 'node--event',
  EVENT_LISTING: 'node--event_listing',
  VAMC_FACILITY: 'node--health_care_local_facility',
  VAMC_SYSTEM: 'node--health_care_region_page',
  // QA: 'node--q_a',
} as const

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]

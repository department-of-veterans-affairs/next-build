export const RESOURCE_TYPES = {
  STORY_LISTING: 'node--story_listing',
  STORY: 'node--news_story',
  QA: 'node--q_a',
} as const

export type ResourceTypeType =
  (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]

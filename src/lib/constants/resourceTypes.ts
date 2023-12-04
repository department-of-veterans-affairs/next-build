export const RESOURCE_TYPES = {
  STORY_LISTING: 'node--story_listing',
  STORY: 'node--news_story',
  QA: 'node--q_a',
  EVENT: 'node--event'
} as const

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]

export const ADDITIONAL_RESOURCE_TYPES = {
  STATIC_PATHS: 'static-path-resources',
}

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

export const PARAGRAPH_RESOURCE_TYPES = {
  COLLAPSIBLE_PANEL: 'paragraph--collapsible_panel',
  COLLAPSIBLE_PANEL_ITEM: 'paragraph--collapsible_panel_item',
  TABLE: 'paragraph--table',
  WYSIWYG: 'paragraph--wysiwyg',
  RICH_TEXT_CHAR_LIMIT_1000: 'paragraph--rich_text_char_limit_1000',
} as const

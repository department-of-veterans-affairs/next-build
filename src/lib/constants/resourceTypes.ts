export const RESOURCE_TYPES = {
  EVENT: 'node--event',
  EVENT_LISTING: 'node--event_listing',
  RESOURCES_SUPPORT: 'node--support_resources_detail_page',
  STORY_LISTING: 'node--story_listing',
  STORY: 'node--news_story',
  VAMC_FACILITY: 'node--health_care_local_facility',
  VAMC_SYSTEM: 'node--health_care_region_page',
  VET_CENTER: 'node--vet_center',
  // QA: 'node--q_a',
} as const

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]

export const PARAGRAPH_RESOURCE_TYPES = {
  ACCORDION_ITEM: 'paragraph--basic_accordion',
  ALERT: 'paragraph--alert',
  ALERT_NON_REUSABLE: 'paragraph--non_reusable_alert',
  ALERT_SINGLE: 'paragraph--alert_single',
  AUDIENCE_TOPICS: 'paragraph--audience_topics',
  BUTTON: 'paragraph--button',
  COLLAPSIBLE_PANEL: 'paragraph--collapsible_panel',
  COLLAPSIBLE_PANEL_ITEM: 'paragraph--collapsible_panel_item',
  CONTACT_INFORMATION: 'paragraph--contact_information',
  EMAIL_CONTACT: 'paragraph--email_contact',
  EXPANDABLE_TEXT: 'paragraph--expandable_text',
  FEATURED_CONTENT: 'paragraph--featured_content',
  LINK_TEASER: 'paragraph--link_teaser',
  PHONE_CONTACT: 'paragraph--phone_number',
  PROCESS_LIST: 'paragraph--process',
  REACT_WIDGET: 'paragraph--react_widget',
  RICH_TEXT_CHAR_LIMIT_1000: 'paragraph--rich_text_char_limit_1000',
  // STAFF_PROFILE: 'paragraph--staff_profile',
  TABLE: 'paragraph--table',
  WYSIWYG: 'paragraph--wysiwyg',
  QA: 'paragraph--q_a',
  QA_SECTION: 'paragraph--q_a_section',
  QA_GROUP: 'paragraph--q_a_group',
} as const

export type ParagraphResourceType =
  (typeof PARAGRAPH_RESOURCE_TYPES)[keyof typeof PARAGRAPH_RESOURCE_TYPES]

export const RESOURCE_TYPES = {
  BENEFITS_HUB: 'node--landing_page',
  EVENT: 'node--event',
  EVENT_LISTING: 'node--event_listing',
  HEALTH_SERVICES: 'node--vet_center_facility_health_servi',
  PRESS_RELEASE: 'node--press_release',
  PRESS_RELEASE_LISTING: 'node--press_releases_listing',
  RESOURCES_SUPPORT: 'node--support_resources_detail_page',
  STAFF_PROFILE: 'node--person_profile',
  STORY: 'node--news_story',
  STORY_LISTING: 'node--story_listing',
  SUPPORT_SERVICES: 'node--support_service',
  VAMC_FACILITY: 'node--health_care_local_facility',
  VAMC_SYSTEM: 'node--health_care_region_page',
  VET_CENTER: 'node--vet_center',
  VET_CENTER_OUTSTATION: 'node--vet_center_outstation',
  QA: 'node--q_a',
} as const

// (Node) resources that generate full pages.
// Other entries in RESOURCE_TYPES are Drupal
// nodes that are entity references but that
// do not have individual pages.
export const PAGE_RESOURCE_TYPES = [
  RESOURCE_TYPES.EVENT,
  RESOURCE_TYPES.EVENT_LISTING,
  RESOURCE_TYPES.RESOURCES_SUPPORT,
  RESOURCE_TYPES.PRESS_RELEASE,
  RESOURCE_TYPES.PRESS_RELEASE_LISTING,
  RESOURCE_TYPES.STAFF_PROFILE,
  RESOURCE_TYPES.STORY,
  RESOURCE_TYPES.STORY_LISTING,
  RESOURCE_TYPES.VET_CENTER,
  RESOURCE_TYPES.VET_CENTER_OUTSTATION,
  RESOURCE_TYPES.VAMC_FACILITY,
]

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
  NUMBER_CALLOUT: 'paragraph--number_callout',
  PHONE_CONTACT: 'paragraph--phone_number',
  PROCESS_LIST: 'paragraph--process',
  REACT_WIDGET: 'paragraph--react_widget',
  RICH_TEXT_CHAR_LIMIT_1000: 'paragraph--rich_text_char_limit_1000',
  STAFF_PROFILE: 'paragraph--staff_profile',
  TABLE: 'paragraph--table',
  WYSIWYG: 'paragraph--wysiwyg',
  QA: 'paragraph--q_a',
  QA_SECTION: 'paragraph--q_a_section',
  QA_GROUP: 'paragraph--q_a_group',
} as const

export const BANNER_RESOURCE_TYPES = {
  BASIC: 'banner',
  PROMO: 'promo_banner',
} as const

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]
export type PageResourceType = (typeof PAGE_RESOURCE_TYPES)[number]
export type ParagraphResourceType =
  (typeof PARAGRAPH_RESOURCE_TYPES)[keyof typeof PARAGRAPH_RESOURCE_TYPES]
export type BannerResourceType =
  (typeof BANNER_RESOURCE_TYPES)[keyof typeof BANNER_RESOURCE_TYPES]

import { DrupalFile, DrupalNode } from 'next-drupal'

import { BlockAlert, BlockPromo } from './block'
import {
  FieldAddress,
  FieldFormattedText,
  FieldFormattedTextWithSummary,
  FieldLink,
  FieldOfficeHours,
  FieldSocialMediaLinks,
  FieldTable,
  FieldAdministration,
  BreadcrumbItem,
} from './field_type'
import { DrupalMediaImage } from './media'
import {
  ParagraphAlert,
  ParagraphAlertSingle,
  ParagraphAudienceTopics,
  ParagraphButton,
  ParagraphCollapsiblePanel,
  ParagraphContactInformation,
  ParagraphHealthCareLocalFacilityService,
  ParagraphLinkTeaser,
  ParagraphListOfLinks,
  ParagraphPhoneNumber,
  ParagraphQAGroup,
  ParagraphReactWidget,
  ParagraphRichTextCharLimit1000,
  ParagraphServiceLocation,
  ParagraphStepByStep,
  ParagraphTable,
  ParagraphWysiwyg,
} from './paragraph'
import {
  TaxonomyTermLcCategories,
  TaxonomyTermHealthCareServiceTaxonomy,
} from './taxonomy_term'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** Union of all node types.  */
export type NodeTypes =
  | NodeBanner
  | NodeBasicLandingPage
  | NodeFaqMultipleQA
  | NodeHealthCareLocalFacility
  | NodeLandingPage
  | NodeNewsStory
  | NodeOffice
  | NodePersonProfile
  | NodePromoBanner
  | NodeQA
  | NodeRegionalHealthCareServiceDes
  | NodeStepByStep
  | NodeStoryListing
  | NodeSupportResourcesDetailPage
  | NodeSupportService
  | NodeEvent

/** Node resource types. */
export const enum NodeResourceType {
  Banner = 'node--banner',
  BannerAlert = 'node--full_width_banner_alert',
  Event = 'node--event',
  NewsStory = 'node--news_story',
  FieldListing = 'node--field_listing',
  PersonProfile = 'node--person_profile',
  PromoBanner = 'node--promo_banner',
  QuestionAnswer = 'node--q_a',
  StoryListing = 'node--story_listing',
  SupportResourcesDetailPage = 'node--support_resources_detail_page',
}

/** Node types returned by the custom banner endpoint */
export const enum NodeBannerType {
  PROMO_BANNER = 'node--promo_banner',
  FACILITY_BANNER = 'node--full_width_banner_alert',
  BANNER = 'node--banner',
}

/** Shared type structure for resource nodes. */
export interface NodeAbstractResource extends DrupalNode {
  field_other_categories: TaxonomyTermLcCategories[]
  field_alert_single: ParagraphAlertSingle
  field_buttons: ParagraphButton[]
  field_contact_information: ParagraphContactInformation
  field_intro_text_limited_html: FieldFormattedText
  field_primary_category: TaxonomyTermLcCategories
  field_related_information: ParagraphLinkTeaser[]
  field_tags: ParagraphAudienceTopics
  field_related_benefit_hubs: NodeLandingPage[]
}

export interface NodeBanner extends DrupalNode {
  field_alert_type: string
  body: FieldFormattedTextWithSummary
  field_target_paths: string[]
  field_dismissible_option: string
}

export interface NodeFullWidthBannerAlert extends DrupalNode {
  field_body: FieldFormattedText
  field_alert_dismissable: boolean
  field_alert_type: string
  field_banner_alert_situationinfo: FieldFormattedText
  field_alert_find_facilities_cta: boolean
  field_alert_operating_status_cta: boolean
  field_alert_email_updates_button: boolean
  field_alert_inheritance_subpages: boolean
  field_operating_status_sendemail: boolean
  field_banner_alert_vamcs: NodeBannerAlertVAMCS[]
}

export interface NodeBannerAlertVAMCS extends DrupalNode {
  field_banner_alert: string[]
  field_facility_operating_status: NodeHealthCareLocalFacility
  field_operating_status_emerg_inf: FieldFormattedText
}

export interface NodeBasicLandingPage extends DrupalNode {
  field_table_of_contents_boolean: boolean
  field_content_block: (
    | ParagraphWysiwyg
    | ParagraphListOfLinks
    | ParagraphTable
    | ParagraphReactWidget
    | ParagraphAlert
  )[]
  field_description: string
  field_meta_title: string
  field_intro_text_limited_html: FieldFormattedText
}

export interface NodeFaqMultipleQA extends NodeAbstractResource {
  field_q_a_groups: ParagraphQAGroup[]
  field_table_of_content_boolean: boolean
  field_buttons_repeat: boolean
}

export interface NodeHealthCareLocalFacility extends DrupalNode {
  field_address: FieldAddress
  field_facility_classification: string
  field_operating_status_more_info: string
  field_facility_locator_api_id: string
  field_local_health_care_service_: NodeHealthCareLocalHealthService[]
  field_facility_hours: FieldTable
  field_office_hours: FieldOfficeHours[]
  field_media: DrupalMediaImage
  field_location_services: ParagraphHealthCareLocalFacilityService[]
  field_main_location: boolean
  field_mental_health_phone: string
  field_description: string
  field_mobile: boolean
  field_intro_text: string
  field_phone_number: string
  field_operating_status_facility: string
  field_region_page: NodeHealthCareRegionPage
}

export interface NodeHealthCareLocalHealthService extends DrupalNode {
  field_hservice_appt_intro_select: string
  field_hservice_appt_leadin: string
  field_walk_ins_accepted: string
  field_facility_location: NodeHealthCareLocalFacility
  field_referral_required: string
  field_online_scheduling_availabl: string
  field_phone_numbers_paragraph: ParagraphPhoneNumber[]
  field_service_location: ParagraphServiceLocation[]
  field_regional_health_service: NodeRegionalHealthCareServiceDes
}

export interface NodeHealthCareRegionPage extends DrupalNode {
  field_appointments_online: boolean
  field_media: DrupalMediaImage
  field_related_links: ParagraphListOfLinks
  field_vamc_ehr_system: string
  field_facebook: FieldLink
  field_flickr: FieldLink
  field_govdelivery_id_emerg: string
  field_govdelivery_id_news: string
  field_instagram: FieldLink
  field_description: string
  field_operating_status: FieldLink
  field_other_va_locations: string
  field_intro_text: string
  field_clinical_health_services: NodeHealthCareLocalHealthService[]
  field_twitter: FieldLink
  field_va_health_connect_phone: string
  field_vamc_system_official_name: string
}

export interface NodeLandingPage extends DrupalNode {
  field_related_office: NodeOffice
  field_alert: BlockAlert
  field_title_icon: string
  field_home_page_hub_label: string
  field_teaser_text: string
  field_links: FieldLink[]
  field_description: string
  field_meta_title: string
  field_intro_text: string
  field_plainlanguage_date: string
  field_promo: BlockPromo
  field_related_links: ParagraphListOfLinks
  field_spokes: ParagraphListOfLinks
  field_support_services: NodeSupportService[]
}

/**
 * An individual story published by a Facility.
 *
 * @see https://prod.cms.va.gov/admin/structure/types/manage/news_story/fields */
export interface NodeNewsStory extends DrupalNode {
  /** The credited author of the story. {@link NodePersonProfile} */
  field_author: NodePersonProfile
  /** The primary story text. */
  field_full_story: string
  /** Caption for the attached image. */
  field_image_caption: string
  /** Whether this story is floated to the top of its listing. */
  field_featured: boolean
  /** Lede text that is printed larger. */
  field_intro_text: string
  /** An attached image for the story. */
  field_media: DrupalMediaImage
  /** Where in the story listing this story should display. */
  field_order: number
  /** Which Story Listing page this story should display on. */
  field_listing: NodeStoryListing
  /** Administration */
  field_administration: FieldAdministration
  /** When the node was created. */
  created: string
  /** When the node was last saved by an editor. */
  field_last_saved_by_an_editor?: string | null
}

export interface NodeOffice extends DrupalNode {
  field_body: string
  field_email_updates_link: FieldLink
  field_external_link: FieldLink
  field_description: string
  field_meta_title: string
  field_office_id: string
  field_parent_office: NodeOffice
  field_social_media_links: FieldSocialMediaLinks
}

/** A representation of a staff member of the VA or a VA facility.
 *
 *  @see https://prod.cms.va.gov/admin/structure/types/manage/person_profile/fields
 */
export interface NodePersonProfile extends DrupalNode {
  /** The bio text displayed on the page. */
  field_body: FieldFormattedText
  /** A PDF containing an official biography for distribution. */
  field_complete_biography: DrupalFile
  /** Whether to create a biography. */
  field_complete_biography_create: boolean
  /** The email address of the person. */
  field_email_address: string
  /** First name. */
  field_name_first: string
  /** Introductory text. */
  field_intro_text: string
  /** Whether this person's photo is allowed to be downloaded. */
  field_photo_allow_hires_download: boolean
  /** A brief description of this person's role. */
  field_description: string
  /** Last name. */
  field_last_name: string
  /** Phone number. */
  field_phone_number: string
  /** A photo of the person. */
  field_media: DrupalMediaImage
  /** The office or facility which this person is associated with. */
  field_office: NodeOffice | NodeHealthCareRegionPage
  /** Any honorific suffix, i.e. MD, LCSW, PhD, etc. */
  field_suffix: string
}

/** A individual event published by a facility.
 *
 *  @see https://prod.cms.va.gov/admin/structure/types/manage/event/fields
 */
export interface NodeEvent extends DrupalNode {
  field_additional_information_abo: {
    value: string
    format: string
    processed: string
  }
  field_address?: {
    additionalName?: string | null
    addressLine1?: string
    addressLine2?: string
    administrativeArea?: string
    countryCode?: string
    dependentLocality?: string | null
    familyName?: string | null
    givenName?: string | null
    langcode?: string
    locality?: string
    organization?: string | null
    postalCode?: string | null
    sortingCode?: string | null
  }
  field_location_humanreadable: string
  field_event_cta: string
  field_event_cost: string
  field_datetime_range_timezone: DateTimeRange[]

  field_facility_location: NodeHealthCareLocalFacility
  field_featured: boolean
  field_body: {
    value: string
    format: string
    processed: string
  }
  field_include_registration_info: boolean
  field_location_type: string
  field_order: string
  field_publish_to_outreach_cal: boolean
  field_event_registrationrequired: boolean

  field_description: string
  field_link: fieldLink
  field_url_of_an_online_event: urlOfOnlineEvent
  field_listing: NodeEventListing
  field_last_saved_by_an_editor?: string | null
}

interface fieldLink {
  url: {
    path: string
  }
}

export interface DateTimeRange {
  value: string
  end_value: string
  duration: number
  rrule: number
  rrule_index: number
  timezone: string
}

export interface urlOfOnlineEvent {
  uri: string
  title: string
  options: unknown
}

export interface NodeEventListing extends DrupalNode {
  status: boolean
  breadcrumbs: BreadcrumbItem[]
  moderation_state: string
  path: {
    alias: string
    pid: number
    langcode: string
  }
  field_description: string
  field_enforce_unique_combo: boolean
  field_intro_text: string
  links: {
    self: {
      href: string
    }
  }
  resourceIdObjMeta: {
    drupal_internal__target_id: number
  }
  node_type: {
    type: string
    id: string
    resourceIdObjMeta: unknown
  }
}

export interface NodePromoBanner extends DrupalNode {
  field_target_paths: string[]
  field_promo_type: string
  field_link: FieldLink
}

export interface NodeQA extends NodeAbstractResource {
  field_answer: ParagraphRichTextCharLimit1000
  field_standalone_page: boolean
}

export interface NodeRegionalHealthCareServiceDes extends NodeAbstractResource {
  field_local_health_care_service_: NodeHealthCareLocalHealthService[]
  field_service_name_and_descripti: TaxonomyTermHealthCareServiceTaxonomy[] //@todo
  field_region_page: NodeHealthCareRegionPage
  field_body: string
}

export interface NodeStepByStep extends NodeAbstractResource {
  field_buttons_repeat: boolean
  field_steps: ParagraphStepByStep[]
}

export interface NodeStoryListing extends DrupalNode {
  field_description: string
  field_office: NodeOffice | NodeHealthCareRegionPage
  field_intro_text: string
}

export interface NodeSupportResourcesDetailPage extends NodeAbstractResource {
  field_table_of_content_boolean: boolean
  field_content_block: (
    | ParagraphWysiwyg
    | ParagraphTable
    | ParagraphCollapsiblePanel
    | ParagraphReactWidget
  )[]
  field_buttons_repeat: boolean
}

export interface NodeSupportService extends DrupalNode {
  field_link: FieldLink
  field_phone_number: string
  field_office: NodeOffice
}
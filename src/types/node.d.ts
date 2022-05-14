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
} from './field_type'
import { MediaImage } from './media'
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

/* NodeTypes should contain all node interfaces. */
export type NodeTypes =
  | NodeBanner
  | NodeBasicLandingPage
  | NodeFaqMultipleQA
  | NodeHealthCareLocalFacility
  | NodeLandingPage
  | NodeOffice
  | NodePersonProfile
  | NodePromoBanner
  | NodeQA
  | NodeRegionalHealthCareServiceDes
  | NodeStepByStep
  | NodeStoryListing
  | NodeSupportResourcesDetailPage
  | NodeSupportService

type NodeProps = {
  node: NodeTypes
  viewMode?: string
}

// Several resource node types share fields.
export type NodeAbstractResource = DrupalNode & {
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

export type NodeBanner = DrupalNode & {
  field_alert_type: string
  body: FieldFormattedTextWithSummary
  field_target_paths: string[]
  field_dismissible_option: string
}

export type NodeBasicLandingPage = DrupalNode & {
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

export type NodeFaqMultipleQA = NodeAbstractResource & {
  field_q_a_groups: ParagraphQAGroup[]
  field_table_of_content_boolean: boolean
  field_buttons_repeat: boolean
}

export type NodeHealthCareLocalFacility = DrupalNode & {
  field_address: FieldAddress
  field_facility_classification: string
  field_operating_status_more_info: string
  field_facility_locator_api_id: string
  field_local_health_care_service_: NodeHealthCareLocalHealthService[]
  field_facility_hours: FieldTable
  field_office_hours: FieldOfficeHours[]
  field_media: MediaImage
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

export type NodeHealthCareLocalHealthService = DrupalNode & {
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
export type NodeHealthCareRegionPage = DrupalNode & {
  field_appointments_online: boolean
  field_media: MediaImage
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

export type NodeLandingPage = DrupalNode & {
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

export type NodeNewsStory = DrupalNode & {
  field_author: NodePersonProfile
  field_full_story: FieldFormattedText
  field_image_caption: string
  field_featured: boolean
  field_intro_text: string
  field_media: MediaImage
  field_order: number
  field_listing: NodeStoryListing
}

export type NodeOffice = DrupalNode & {
  field_body: string
  field_email_updates_link: FieldLink
  field_external_link: FieldLink
  field_description: string
  field_meta_title: string
  field_office_id: string
  field_parent_office: NodeOffice
  field_social_media_links: FieldSocialMediaLinks
}

export type NodePersonProfile = DrupalNode & {
  field_body: string
  field_complete_biography: DrupalFile
  field_complete_biography_create: boolean
  field_email_address: string
  field_name_first: string
  field_intro_text: string
  field_photo_allow_hires_download: boolean
  field_description: string
  field_last_name: string
  field_phone_number: string
  field_media: MediaImage
  field_office: NodeOffice | NodeHealthCareRegionPage
  field_suffix: string
}

export type NodePromoBanner = DrupalNode & {
  field_target_paths: string[]
  field_promo_type: string
  field_link: FieldLink
}

export type NodeQA = NodeAbstractResource & {
  field_answer: ParagraphRichTextCharLimit1000
  field_standalone_page: boolean
  field_q_a_groups: ParagraphQAGroup[]
}

export type NodeRegionalHealthCareServiceDes = NodeAbstractResource & {
  field_local_health_care_service_: NodeHealthCareLocalHealthService[]
  field_service_name_and_descripti: TaxonomyTermHealthCareServiceTaxonomy[] //@todo
  field_region_page: NodeHealthCareRegionPage
  field_body: string
}
export type NodeStepByStep = NodeAbstractResource & {
  field_buttons_repeat: boolean
  field_steps: ParagraphStepByStep[]
}

export type NodeStoryListing = DrupalNode & {
  field_description: string
  field_office: NodeOffice | NodeHealthCareRegionPage
  field_intro_text: string
}

export type NodeSupportResourcesDetailPage = NodeAbstractResource & {
  field_table_of_content_boolean: boolean
  field_content_block: (
    | ParagraphWysiwyg
    | ParagraphTable
    | ParagraphCollapsiblePanel
    | ParagraphReactWidget
  )[]
  field_buttons_repeat: boolean
}

export type NodeSupportService = DrupalNode & {
  field_link: FieldLink
  field_phone_number: string
  field_office: NodeOffice
}

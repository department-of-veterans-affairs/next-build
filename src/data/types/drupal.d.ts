import { DrupalFile, DrupalMedia, DrupalNode } from "next-drupal"

export interface FieldAddress {
  langcode: string
  country_code: string
  administrative_area: string
  locality: string
  dependent_locality: string
  postal_code: string
  sorting_code: string
  address_line1: string
  address_line2: string
}

export interface FieldFormattedText {
  value: string
  format: string
  processed: string
}

export interface FieldFormattedTextWithSummary extends FieldFormattedText {
  summary: string
}

export interface FieldLink {
  uri: string
  title: string
  options: [string[]]
}

export interface FieldOfficeHours {
  day: number
  starthours: number
  endhours: number
  comment: string
}

export interface FieldSocialMediaLinks {
  platform: string
  value: string
  platform_values: {
    twitter: {
      value: string
    }
    facebook: {
      value: string
    }
    youtube: {
      value: string
    }
    instagram: {
      value: string
    }
    linkedin: {
      value: string
    }
  }
}

export interface FieldTable {
  value: [string[]]
  caption: string
}

export interface MediaImage extends DrupalMedia {
  field_description: string
  image: DrupalFile
}

import { DrupalParagraph } from 'next-drupal'

import { BlockAlert } from './block'
import {
  FieldAddress,
  FieldFormattedText,
  FieldLink,
  FieldOfficeHours,
  FieldTable,
} from './field_type'
import { MediaImage } from './media'
import {
  NodeLandingPage,
  NodePersonProfile,
  NodeQA,
  NodeSupportService,
} from './node'
import {
  TaxonomyTermAudienceBeneficiaries,
  TaxonomyTermAudienceNonBeneficiaries,
  TaxonomyTermTopics,
} from './taxonomy_term'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** Union of all paragraph types.  */
export type ParagraphTypes =
  | ParagraphAlert
  | ParagraphAlertSingle
  | ParagraphAudienceTopics
  | ParagraphButton
  | ParagraphCollapsiblePanel
  | ParagraphCollapsiblePanelItem
  | ParagraphContactInformation
  | ParagraphEmailContact
  | ParagraphExpandableText
  | ParagraphHealthCareLocalFacilityService
  | ParagraphLinkTeaser
  | ParagraphListOfLinks
  | ParagraphNonReusableAlert
  | ParagraphPhoneNumber
  | ParagraphQAGroup
  | ParagraphReactWidget
  | ParagraphRichTextCharLimit1000
  | ParagraphServiceLocation
  | ParagraphServiceLocationAddress
  | ParagraphStaffProfile
  | ParagraphStep
  | ParagraphStepByStep
  | ParagraphTable
  | ParagraphWysiwyg

/** Paragraph resource types. */
export const enum ParagraphResourceType {
  AudienceTopics = 'paragraph--audience_topics',
  Button = 'paragraph--button',
  EmailContact = 'paragraph--email_contact',
  ExpandableText = 'paragraph--expandable_text',
  LinkTeaser = 'paragraph--link_teaser',
  StaffProfile = 'paragraph--staff_profile',
  Table = 'paragraph--table',
  Wysiwyg = 'paragraph--wysiwyg',
  RichTextCharLimit1000 = 'paragraph--rich_text_char_limit_1000',
}

export interface ParagraphAlert extends DrupalParagraph {
  field_alert_heading: string
  field_alert_type: string
  field_alert_block_reference: BlockAlert
  field_va_paragraphs: (ParagraphExpandableText | ParagraphWysiwyg)[]
}

export interface ParagraphAlertSingle extends DrupalParagraph {
  field_alert_section: string
  field_alert_block_reference: BlockAlert
  field_alert_non_reusable_ref: ParagraphNonReusableAlert
}

export interface ParagraphAudienceTopics extends DrupalParagraph {
  field_audience_selection: string | null
  field_audience_beneficiares: TaxonomyTermAudienceBeneficiaries
  field_non_beneficiares: TaxonomyTermAudienceNonBeneficiaries
  field_topics: TaxonomyTermTopics[] // Up to 4; can this be typed?
}

export interface ParagraphButton extends DrupalParagraph {
  field_button_label: string
  field_button_link: FieldLink
}

export interface ParagraphCollapsiblePanel extends DrupalParagraph {
  field_collapsible_panel_bordered: boolean
  field_collapsible_panel_expand: boolean
  field_collapsible_panel_multi: boolean
  field_va_paragraphs: ParagraphCollapsiblePanelItem[]
}

export interface ParagraphCollapsiblePanelItem extends DrupalParagraph {
  field_title: string
  field_wysiwyg: FieldFormattedText
  field_va_paragraphs: ParagraphTable[]
}

export interface ParagraphContactInformation extends DrupalParagraph {
  field_contact_info_switch: string
  field_additional_contact: ParagraphEmailContact | ParagraphPhoneNumber
  field_benefit_hub_contacts: NodeLandingPage
  field_contact_default: NodeSupportService
}

export interface ParagraphEmailContact extends DrupalParagraph {
  field_email_address: string
  field_email_label: string
}

export interface ParagraphExpandableText extends DrupalParagraph {
  field_wysiwyg: FieldFormattedText
  field_text_expander: string
}

export interface ParagraphHealthCareLocalFacilityService
  extends DrupalParagraph {
  field_title: string
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphLinkTeaser extends DrupalParagraph {
  field_link: FieldLink
  field_link_summary: string
}

export interface ParagraphListOfLinks extends DrupalParagraph {
  field_link: FieldLink
  field_links: FieldLink[]
  field_section_header: string
}

export interface ParagraphNonReusableAlert extends DrupalParagraph {
  field_alert_type: string
  field_alert_heading: string
  field_va_paragraphs: (ParagraphExpandableText | ParagraphWysiwyg)[]
}

export interface ParagraphPhoneNumber extends DrupalParagraph {
  field_phone_extension: string
  field_phone_label: string
  field_phone_number: string
  field_phone_number_type: string
}

export interface ParagraphQAGroup extends DrupalParagraph {
  field_accordion_display: boolean
  field_q_as: NodeQA[]
  field_section_header: string
}

export interface ParagraphReactWidget extends DrupalParagraph {
  field_cta_widget: boolean
  field_default_link: FieldLink
  field_button_format: boolean
  field_error_message: FieldFormattedText
  field_loading_message: string
  field_timeout: number
  field_widget_type: string
}

export interface ParagraphRichTextCharLimit1000 extends DrupalParagraph {
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphServiceLocation extends DrupalParagraph {
  field_additional_hours_info: string
  field_service_location_address: ParagraphServiceLocationAddress
  field_email_contacts: ParagraphEmailContact[]
  field_office_hours: FieldOfficeHours[]
  field_phone: ParagraphPhoneNumber[]
  field_hours: string
  field_use_main_facility_phone: boolean
}

export interface ParagraphServiceLocationAddress extends DrupalParagraph {
  field_address: FieldAddress
  field_building_name_number: string
  field_clinic_name: string
  field_use_facility_address: boolean
  field_wing_floor_or_room_number: string
}

export interface ParagraphStaffProfile extends DrupalParagraph {
  field_staff_profile: NodePersonProfile
}

export interface ParagraphStep extends DrupalParagraph {
  field_alert: ParagraphAlertSingle
  field_media: MediaImage
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphStepByStep extends DrupalParagraph {
  field_step: ParagraphStep[]
  field_section_header: string
}

export interface ParagraphTable extends DrupalParagraph {
  field_table: FieldTable
}

export interface ParagraphWysiwyg extends DrupalParagraph {
  field_wysiwyg: FieldFormattedText
}

export interface NodeHealthCareLocalFacility extends DrupalNode {
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

export interface NodeNewsStory extends DrupalNode {
  /** The credited author of the story. {@link NodePersonProfile} */
  field_author: NodePersonProfile
  /** The primary story text. */
  field_full_story: FieldFormattedText
  /** Caption for the attached image. */
  field_image_caption: string
  /** Whether this story is floated to the top of its listing. */
  field_featured: boolean
  /** Lede text that is printed larger. */
  field_intro_text: string
  /** An attached image for the story. */
  field_media: MediaImage
  /** Where in the story listing this story should display. */
  field_order: number
  /** Which Story Listing page this story should display on. */
  field_listing: NodeStoryListing
  /** When the node was created. */
  created: string
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
  field_media: MediaImage
  /** The office or facility which this person is associated with. */
  field_office: NodeOffice | NodeHealthCareRegionPage
  /** Any honorific suffix, i.e. MD, LCSW, PhD, etc. */
  field_suffix: string
}

export interface NodeRegionalHealthCareServiceDes extends NodeAbstractResource {
  field_local_health_care_service_: NodeHealthCareLocalHealthService[]
  field_service_name_and_descripti: TaxonomyTermHealthCareServiceTaxonomy[] //@todo
  field_region_page: NodeHealthCareRegionPage
  field_body: string
}

export interface NodeStoryListing extends DrupalNode {
  field_description: string
  field_office: NodeOffice | NodeHealthCareRegionPage
  field_intro_text: string
}

export interface TaxonomyTermHealthCareServiceTaxonomy
  extends DrupalTaxonomyTerm {
  field_vet_center_com_conditions: string
  field_commonly_treated_Condition: string
  field_health_service_api_id: string
  field_also_known_as: string
  field_vet_center_friendly_name: string
  field_vet_center_service_descrip: string
  field_vet_center_required_servic: boolean
  field_service_type_of_care: string
  field_vet_center_type_of_care: string
  field_vha_healthservice_stopcode: number
}

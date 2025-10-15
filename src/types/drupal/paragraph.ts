import { DrupalNode, DrupalParagraph } from 'next-drupal'

import { BlockAlert } from './block'
import {
  FieldAddress,
  FieldFormattedText,
  FieldLink,
  FieldOfficeHours,
  FieldTable,
  FieldDateTimeRange,
} from './field_type'
import {
  DrupalMediaImage,
  DrupalMediaDocument,
  DrupalMediaVideo,
} from './media'
import { NodeLandingPage, NodePersonProfile, NodeSupportService } from './node'
import {
  TaxonomyTermAudienceBeneficiaries,
  TaxonomyTermAudienceNonBeneficiaries,
  TaxonomyTermTopics,
} from './taxonomy_term'

/** Union of all paragraph types. This is a discriminated union using the 'type' property. */
export type ParagraphTypes =
  | ParagraphAccordion
  | ParagraphAlert
  | ParagraphAlertSingle
  | ParagraphAudienceTopics
  | ParagraphButton
  | ParagraphCollapsiblePanel
  | ParagraphCollapsiblePanelItem
  | ParagraphContactInformation
  | ParagraphDownloadableFile
  | ParagraphEmailContact
  | ParagraphExpandableText
  | ParagraphFeaturedContent
  | ParagraphHealthCareLocalFacilityService
  | ParagraphLinkTeaser
  | ParagraphListOfLinks
  | ParagraphListOfLinkTeasers
  | ParagraphNonReusableAlert
  | ParagraphNumberCallout
  | ParagraphPhoneNumber
  | ParagraphProcessList
  | ParagraphQA
  | ParagraphQaGroup
  | ParagraphQaSection
  | ParagraphReactWidget
  | ParagraphRichTextCharLimit1000
  | ParagraphServiceLocation
  | ParagraphServiceLocationAddress
  | ParagraphSituationUpdate
  | ParagraphStaffProfile
  | ParagraphStep
  | ParagraphStepByStep
  | ParagraphTable
  | ParagraphWysiwyg

export interface ParagraphAccordion extends DrupalParagraph {
  type: 'paragraph--basic_accordion'
  field_header: string
  field_rich_wysiwyg: FieldFormattedText
}

export interface ParagraphAlert extends DrupalParagraph {
  type: 'paragraph--alert'
  field_alert_heading: string
  field_alert_type: string
  field_alert_block_reference: BlockAlert
  field_va_paragraphs: (ParagraphExpandableText | ParagraphWysiwyg)[]
}

export interface ParagraphAlertSingle extends DrupalParagraph {
  type: 'paragraph--alert_single'
  field_alert_selection: string
  field_alert_block_reference: BlockAlert
  field_alert_non_reusable_ref: ParagraphNonReusableAlert
}

export interface ParagraphAudienceTopics extends DrupalParagraph {
  type: 'paragraph--audience_topics'
  field_audience_selection: string | null
  field_audience_beneficiares: TaxonomyTermAudienceBeneficiaries[]
  field_non_beneficiares: TaxonomyTermAudienceNonBeneficiaries[]
  field_topics: TaxonomyTermTopics[] // Up to 4; can this be typed?
}

export interface ParagraphButton extends DrupalParagraph {
  type: 'paragraph--button'
  field_button_label: string
  field_button_link: FieldLink
}

export interface ParagraphCollapsiblePanel extends DrupalParagraph {
  type: 'paragraph--collapsible_panel'
  field_collapsible_panel_bordered: boolean
  field_va_paragraphs: ParagraphCollapsiblePanelItem[]

  // Editors don't have control over these fields, so we don't use them
  // field_collapsible_panel_expand: boolean
  // field_collapsible_panel_multi: boolean
}

export interface ParagraphCollapsiblePanelItem extends DrupalParagraph {
  type: 'paragraph--collapsible_panel_item'
  field_title: string
  field_wysiwyg: FieldFormattedText
  field_va_paragraphs: ParagraphTable[]
}

export interface ParagraphContactInformation extends DrupalParagraph {
  type: 'paragraph--contact_information'
  field_contact_info_switch: string
  field_additional_contact: ParagraphEmailContact | ParagraphPhoneNumber
  field_benefit_hub_contacts: NodeLandingPage
  field_contact_default: NodeSupportService
}

export interface ParagraphDownloadableFile extends DrupalParagraph {
  type: 'paragraph--downloadable_file'
  field_title: string
  field_markup: string | null
  field_media: DrupalMediaImage | DrupalMediaDocument | DrupalMediaVideo
}

export interface ParagraphEmailContact extends DrupalParagraph {
  type: 'paragraph--email_contact'
  field_email_address: string
  field_email_label: string
}

export interface ParagraphExpandableText extends DrupalParagraph {
  type: 'paragraph--expandable_text'
  field_wysiwyg: FieldFormattedText
  field_text_expander: string
}

export interface ParagraphFeaturedContent extends DrupalParagraph {
  type: 'paragraph--featured_content'
  field_section_header: string
  field_description: FieldFormattedText
  field_cta?: ParagraphButton
}

export interface ParagraphCCFeaturedContent {
  fetched: {
    // This normalizes the centralized content field_cta field to allow formatting
    field_cta: Omit<ParagraphButton, 'drupal_internal__id' | 'id'>[]
    field_description: FieldFormattedText[]
    field_section_header: Array<{ value: string }>
  }
}

export interface ParagraphCCQaSection {
  target_type: string
  fetched_bundle: string
  fetched: {
    field_accordion_display: Array<{ value: string }>
    field_questions: Omit<ParagraphQA, 'drupal_internal__id' | 'id'>[]
  }
}

export interface ParagraphHealthCareLocalFacilityService
  extends DrupalParagraph {
  type: 'paragraph--health_care_local_facility_servi'
  field_title: string
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphLinkTeaser extends DrupalParagraph {
  type: 'paragraph--link_teaser'
  field_link: FieldLink
  field_link_summary: string
}

export interface ParagraphListOfLinkTeasers extends DrupalParagraph {
  type: 'paragraph--list_of_link_teasers'
  field_title: string
  field_va_paragraphs: ParagraphLinkTeaser[]
}

export interface ParagraphListOfLinks extends DrupalParagraph {
  type: 'paragraph--list_of_links'
  field_link: FieldLink
  field_links: FieldLink[]
  field_section_header: string
}

export interface ParagraphNonReusableAlert extends DrupalParagraph {
  type: 'paragraph--non_reusable_alert'
  field_alert_type: string
  field_alert_heading: string
  field_va_paragraphs: (ParagraphExpandableText | ParagraphWysiwyg)[]
}

export interface ParagraphNumberCallout extends DrupalParagraph {
  type: 'paragraph--number_callout'
  field_short_phrase_with_a_number: string
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphPhoneNumber extends DrupalParagraph {
  type: 'paragraph--phone_number'
  field_phone_extension: string
  field_phone_label: string
  field_phone_number: string
  field_phone_number_type: 'sms' | 'tty' | 'fax' | string
}

export interface ParagraphProcessList extends DrupalParagraph {
  type: 'paragraph--process'
  field_steps: FieldFormattedText[]
}

export interface ParagraphQA extends DrupalParagraph {
  type: 'paragraph--q_a'
  field_answer: ParagraphTypes[]
  field_question: string
}

export interface ParagraphQaGroup extends DrupalParagraph {
  type: 'paragraph--q_a_group'
  field_accordion_display: boolean
  field_q_as: ParagraphSectionQas[]
  field_section_header: string
}

export interface ParagraphSectionQas extends DrupalNode {
  title: string
  field_answer: ParagraphWysiwyg
}

export interface ParagraphQaSection extends DrupalParagraph {
  type: 'paragraph--q_a_section'
  field_section_header: string
  field_accordion_display: boolean
  field_section_intro: string
  field_questions: ParagraphQA[]
}

export interface ParagraphReactWidget extends DrupalParagraph {
  type: 'paragraph--react_widget'
  field_cta_widget: boolean
  field_default_link: FieldLink
  field_button_format: boolean
  field_error_message: FieldFormattedText
  field_loading_message: string
  field_timeout: number
  field_widget_type: string
}

export interface ParagraphRichTextCharLimit1000 extends DrupalParagraph {
  type: 'paragraph--rich_text_char_limit_1000'
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphServiceLocation extends DrupalParagraph {
  type: 'paragraph--service_location'
  /** Type of office visits supported (e.g., "no", "yes_appointment_only"). */
  field_office_visits?: string
  /** Type of virtual support available (e.g., "yes_veterans_can_call"). */
  field_virtual_support?: string
  /** Appointment intro text type ("remove_text", "customize_text", "use_default_text"). */
  field_appt_intro_text_type?:
    | 'remove_text'
    | 'customize_text'
    | 'use_default_text'
    | string
  /** Custom appointment intro text (if applicable). */
  fieldApptIntro_text_custom?: string
  /** Array of additional phone numbers for appointments or contact. */
  field_other_phone_numbers?: ParagraphPhoneNumber[]
  /** Indicates if online scheduling is available ("yes" or others). */
  field_online_scheduling_avail?: 'yes' | string
  /** Array of additional contact phone numbers. */
  field_phone?: ParagraphPhoneNumber[]
  /** Array of email contact objects. */
  field_email_contacts?: ParagraphEmailContact[]
  /** Service hours configuration ("0" for facility hours, "1" for unspecified, "2" for specific hours). */
  field_hours?: '0' | '1' | '2' | string
  /** Specific service office hours (array of hour objects). */
  field_office_hours?: FieldOfficeHours[]
  /** Additional information about service hours. */
  field_additional_hours_info?: string
  /** Indicates if the main facility phone number should be used (true/false). */
  field_use_main_facility_phone?: boolean
  /** Indicates if the facility phone number should be used for appointments (true/false). */
  field_use_facility_phone_number?: boolean
  /** Optional service location address entity. */
  field_service_location_address?: ParagraphServiceLocationAddress
}

export interface ParagraphServiceLocationAddress extends DrupalParagraph {
  type: 'paragraph--service_location_address'
  field_address: FieldAddress
  field_building_name_number: string
  field_clinic_name: string
  /**
   * Indicates whether to show the service address in the location card.
   *
   * If true, the service address will be shown.
   * If false, no address will be shown in the location card (because it's the
   * same as the facility.)
   */
  field_use_facility_address: boolean
  field_wing_floor_or_room_number: string
}

export interface ParagraphStaffProfile extends DrupalParagraph {
  type: 'paragraph--staff_profile'
  field_staff_profile: NodePersonProfile
}

export interface ParagraphStep extends DrupalParagraph {
  type: 'paragraph--step'
  field_alert: ParagraphAlertSingle
  field_media: DrupalMediaImage
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphStepByStep extends DrupalParagraph {
  type: 'paragraph--step_by_step'
  field_step: ParagraphStep[]
  field_section_header: string
}

export interface ParagraphTable extends DrupalParagraph {
  type: 'paragraph--table'
  field_table: FieldTable
}

export interface ParagraphWysiwyg extends DrupalParagraph {
  type: 'paragraph--wysiwyg'
  field_wysiwyg: FieldFormattedText
}

export interface ParagraphSituationUpdate extends DrupalParagraph {
  type: 'paragraph--situation_update'
  field_datetime_range_timezone: FieldDateTimeRange
  field_wysiwyg: FieldFormattedText
  field_send_email_to_subscribers: boolean
}

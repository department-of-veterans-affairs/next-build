import { DrupalNode, DrupalParagraph } from 'next-drupal'

import { BlockAlert } from './block'
import {
  FieldAddress,
  FieldFormattedText,
  FieldLink,
  FieldOfficeHours,
  FieldTable,
} from './field_type'
import { DrupalMediaImage } from './media'
import { NodeLandingPage, NodePersonProfile, NodeSupportService } from './node'
import {
  TaxonomyTermAudienceBeneficiaries,
  TaxonomyTermAudienceNonBeneficiaries,
  TaxonomyTermTopics,
} from './taxonomy_term'

/** Union of all paragraph types.  */
export type ParagraphTypes =
  | ParagraphAccordion
  | ParagraphAlert
  | ParagraphAlertSingle
  | ParagraphAudienceTopics
  | ParagraphButton
  | ParagraphCollapsiblePanel
  | ParagraphCollapsiblePanelItem
  | ParagraphContactInformation
  | ParagraphEmailContact
  | ParagraphExpandableText
  | ParagraphFeaturedContent
  | ParagraphHealthCareLocalFacilityService
  | ParagraphLinkTeaser
  | ParagraphListOfLinks
  | ParagraphNonReusableAlert
  | ParagraphPhoneNumber
  | ParagraphQaGroup
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
  Accordion = 'paragraph--basic_accordion',
  ParagraphQA = 'paragraph--q_a',
}

export interface ParagraphAccordion extends DrupalParagraph {
  field_header: string
  field_rich_wysiwyg: FieldFormattedText
}

export interface ParagraphAlert extends DrupalParagraph {
  field_alert_heading: string
  field_alert_type: string
  field_alert_block_reference: BlockAlert
  field_va_paragraphs: (ParagraphExpandableText | ParagraphWysiwyg)[]
}

export interface ParagraphAlertSingle extends DrupalParagraph {
  field_alert_selection: string
  field_alert_block_reference: BlockAlert
  field_alert_non_reusable_ref: ParagraphNonReusableAlert
}

export interface ParagraphAudienceTopics extends DrupalParagraph {
  field_audience_selection: string | null
  field_audience_beneficiares: TaxonomyTermAudienceBeneficiaries[]
  field_non_beneficiares: TaxonomyTermAudienceNonBeneficiaries[]
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

export interface ParagraphFeaturedContent extends DrupalParagraph {
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

export interface ParagraphCCVetCenterFaqs {
  fetched_bundle: string
  fetched: {
    field_accordion_display: Array<{ value: string }>
    field_questions: Omit<ParagraphQA, 'drupal_internal__id' | 'id'>[]
  }
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

export interface ParagraphProcessList extends DrupalParagraph {
  field_steps: FieldFormattedText[]
}

export interface ParagraphQA extends DrupalParagraph {
  field_answer: DrupalParagraph[]
  field_question: string
  type: string
}

export interface ParagraphQaGroup extends DrupalParagraph {
  field_accordion_display: boolean
  field_q_as: ParagraphSectionQas[]
  field_section_header: string
}

export interface ParagraphSectionQas extends DrupalNode {
  title: string
  field_answer: ParagraphWysiwyg
}

export interface ParagraphQaSection extends DrupalParagraph {
  field_section_header: string
  field_accordion_display: boolean
  field_section_intro: string
  field_questions: DrupalParagraph[]
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
  field_media: DrupalMediaImage
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

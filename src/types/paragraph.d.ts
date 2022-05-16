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
  NodeNewsStory,
  NodeQA,
  NodeSupportService,
} from './node'
import {
  TaxonomyTermAudienceBeneficiaries,
  TaxonomyTermAudienceNonBeneficiaries,
  TaxonomyTermTopics,
} from './taxonomy_term'

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
  field_audience_beneficiaries: TaxonomyTermAudienceBeneficiaries
  field_non_beneficiaries: TaxonomyTermAudienceNonBeneficiaries
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

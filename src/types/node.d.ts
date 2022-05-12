import { DrupalFile, DrupalNode } from 'next-drupal'

import { BlockAlert, BlockPromo } from './block'
import {
  FieldFormattedText,
  FieldFormattedTextWithSummary,
  FieldLink,
} from './field_type'
import { MediaImage } from './media'
import {
  ParagraphAlert,
  ParagraphAudienceTopics,
  ParagraphButton,
  ParagraphCollapsiblePanel,
  ParagraphContactInformation,
  ParagraphLinkTeaser,
  ParagraphListOfLinks,
  ParagraphQAGroup,
  ParagraphReactWidget,
  ParagraphRichTextCharLimit1000,
  ParagraphStepByStep,
  ParagraphTable,
  ParagraphWysiwyg,
} from './paragraph'
import { TaxonomyTermLcCategories } from './taxonomy_term'

// Several resource node types share fields.
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

export interface NodeHealthCareRegionPage extends DrupalNode {
  foo: string // @todo
}

export interface NodeLandingPage extends DrupalNode {
  field_related_office: NodeOffice
  field_alert: BlockAlert
  field_title_icon: string
  field_home_page_hub_label: string
  field_teaser_text: string
  field_links: FieldLink[]
  field_description: string
  field_meta_tags: any
  field_meta_title: string
  field_intro_text: string
  field_plainlanguage_date: any
  field_promo: BlockPromo
  field_related_links: ParagraphListOfLinks
  field_spokes: ParagraphListOfLinks
  field_support_services: NodeSupportService[]
}

export interface NodeNewsStory extends DrupalNode {
  field_author: NodePersonProfile
  field_full_story: FieldFormattedText
  field_image_caption: string
  field_featured: boolean
  field_intro_text: string
  field_media: MediaImage
  field_meta_tags: any
  field_order: number
  field_listing: NodeStoryListing
}

export interface NodePersonProfile extends DrupalNode {
  field_body: string
  field_complete_biography: DrupalFile
  field_complete_biography_create: boolean
  field_email_address: string
  field_name_first: string
  field_intro_text: string
  field_photo_allow_hires_download: boolean
  field_description: string
  field_last_name: string
  field_meta_tags: any
  field_phone_number: string
  field_media: MediaImage
  field_office: NodeOffice | NodeHealthCareRegionPage
  field_suffix: string
}

export interface PromoBanner extends DrupalNode {
  field_target_paths: string[]
  field_promo_type: string
  field_link: FieldLink
}

export interface NodeQA extends NodeAbstractResource {
  field_answer: ParagraphRichTextCharLimit1000
  field_standalone_page: boolean
  field_q_a_groups: ParagraphQAGroup[]
}

export interface NodeStepByStep extends NodeAbstractResource {
  field_buttons_repeat: boolean
  field_steps: ParagraphStepByStep[]
}

export interface NodeStoryListing extends DrupalNode {
  field_description: string
  field_meta_tags: any
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

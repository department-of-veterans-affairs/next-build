import { DrupalBlock } from 'next-drupal'
import { MediaImage } from './media'
import {
  ParagraphExpandableText,
  ParagraphLinkTeaser,
  ParagraphWysiwyg,
} from './paragraph'

export interface BlockAlert extends DrupalBlock {
  field_alert_title: string
  field_alert_type: string
  field_reusability: string
  field_alert_content: ParagraphExpandableText | ParagraphWysiwyg
}

export interface BlockPromo extends DrupalBlock {
  field_image: MediaImage
  field_promo_link: ParagraphLinkTeaser
}

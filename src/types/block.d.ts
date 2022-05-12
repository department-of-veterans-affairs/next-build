import { DrupalBlock } from 'next-drupal'
import { ParagraphExpandableText, ParagraphWysiwyg } from './paragraph'

export interface BlockAlert extends DrupalBlock {
  field_alert_title: string
  field_alert_type: string
  field_reusability: string
  field_alert_content: ParagraphExpandableText | ParagraphWysiwyg
}

export interface BlockPromo extends DrupalBlock {
  foo: string //@todo
}

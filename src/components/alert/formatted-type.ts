import { FormattedParagraph } from '@/lib/drupal/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'
import { ExpandableText } from '@/components/expandableText/formatted-type'

export type AlertType = 'info' | 'warning'

export type AlertBlock = {
  alertType: AlertType
  id: string
  title: string
  // content: {
  //   header?: string
  //   text: string
  // }
  content: Wysiwyg | ExpandableText
}

export type AlertNonReusable = PublishedParagraph & {
  type: 'paragraph--non_reusable_alert'
  alertType: AlertType
  heading: string
  paragraphs: FormattedParagraph[]
}

export type Alert = PublishedParagraph & {
  type: 'paragraph--alert'
  alertType: AlertType
  heading: string
  blockReference: AlertBlock
  paragraphs?: FormattedParagraph[]
}

export type AlertSingle = PublishedParagraph & {
  type: 'paragraph--alert_single'
  alertSelection: 'R' | 'NR'
  blockReference: AlertBlock
  nonReusableRef: AlertNonReusable
}

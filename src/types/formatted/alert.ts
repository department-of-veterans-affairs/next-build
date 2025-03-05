import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { ExpandableText } from '@/types/formatted/expandableText'

export type AlertType = 'info' | 'warning'

export type AlertBlock = {
  alertType: AlertType
  id: string
  title: string
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

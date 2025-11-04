import { FormattedParagraph } from '@/lib/drupal/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type CollapsiblePanelItem = PublishedParagraph & {
  type: 'paragraph--collapsible_panel_item'
  title: string
  wysiwyg: string
  paragraphs?: FormattedParagraph[]
  expanded?: boolean
}

export type CollapsiblePanel = PublishedParagraph & {
  type: 'paragraph--collapsible_panel'
  paragraphs: CollapsiblePanelItem[]
  bordered?: boolean
}

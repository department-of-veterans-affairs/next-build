import { Paragraph } from '@/types/formatted/paragraph'
import { HeadingLevel } from '@/types/formatted/headingElement'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type CollapsiblePanelItem = PublishedParagraph & {
  type: 'paragraph--collapsible_panel_item'
  title: string
  wysiwyg: string
  headingLevel?: HeadingLevel
  paragraphs?: Paragraph[]
  expanded?: boolean
}

export type CollapsiblePanel = PublishedParagraph & {
  type: 'paragraph--collapsible_panel'
  paragraphs: CollapsiblePanelItem[]
  bordered?: boolean
  startExpanded?: boolean
  multiSelect?: boolean
  headingLevel?: HeadingLevel
}

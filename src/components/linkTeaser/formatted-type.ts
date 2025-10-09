import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

// Formatted LinkTeaser for use in most components
export type FormattedLinkTeaser = PublishedParagraph & {
  type: 'paragraph--link_teaser'
  title: string
  summary: string
  uri: string
  parentField: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: { [key: string]: any }
  componentParams: {
    sectionHeader: string
  }
}

// Union type that can handle both formatted and raw Drupal data
export type LinkTeaser = FormattedLinkTeaser | ParagraphLinkTeaser

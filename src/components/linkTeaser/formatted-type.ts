import { PublishedParagraph } from '@/types/formatted/publishedEntity'

// Formatted LinkTeaser for use in most components
export type LinkTeaser = PublishedParagraph & {
  type: 'paragraph--link_teaser'
  title: string
  summary: string
  uri: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: { [key: string]: any }
  componentParams: {
    sectionHeader: string
  }
}

import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type LinkTeaser = PublishedParagraph & {
  type: 'paragraph--link_teaser'
  title: string
  summary: string
  uri: string
  parentField: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
  componentParams: {
    boldTitle: boolean
    sectionHeader: string
  }
}

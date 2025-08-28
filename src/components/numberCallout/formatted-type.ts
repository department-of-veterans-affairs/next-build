import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type NumberCallout = PublishedParagraph & {
  type: 'paragraph--number_callout'
  numberPhrase: string
  description: string
}

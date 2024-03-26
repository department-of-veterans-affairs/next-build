import { PublishedParagraph } from './publishedEntity'

export type NumberCallout = PublishedParagraph & {
  type: 'paragraph--number_callout'
  numberPhrase: string
  description: string
}

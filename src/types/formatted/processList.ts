import { PublishedParagraph } from './publishedEntity'

export type ProcessList = PublishedParagraph & {
  type: 'paragraph--process'
  steps: { html: string }[]
}

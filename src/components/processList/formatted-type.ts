import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type ProcessList = PublishedParagraph & {
  type: 'paragraph--process'
  steps: { html: string }[]
}

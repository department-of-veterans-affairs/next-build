import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type Button = PublishedParagraph & {
  type: 'paragraph--button'
  id: string
  label: string
  url: string
}

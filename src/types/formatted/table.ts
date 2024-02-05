import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type Table = PublishedParagraph & {
  type: 'paragraph--table'
  data: string[][]
  title?: string
}

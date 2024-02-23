import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type ExpandableText = PublishedParagraph & {
  type: 'paragraph--expandable_text'
  id: string
  header: string
  text: string
}

import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type ChecklistItems = {
  type: 'paragraph--checklist'
  items: string[]
  header: string
  intro: string
}

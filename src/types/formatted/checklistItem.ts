import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type ChecklistItem = {
  type: 'paragraph--checklist_item'
  items: string[]
  header: string
  intro: string
}

import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type AccordionItem = PublishedParagraph & {
  type: 'paragraph--basic_accordion'
  header: string
  html: string
  itemLevel?: number
}

export type Accordion = {
  id: string
  bordered: boolean
  items: AccordionItem[]
}

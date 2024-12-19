import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type Accordion = {
  id: string
  bordered: boolean
  items: AccordionItem[]
}

export type AccordionItem = PublishedParagraph & {
  type: 'paragraph--basic_accordion'
  header: string
  html: string
}

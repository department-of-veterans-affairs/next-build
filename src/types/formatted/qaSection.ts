import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from './publishedEntity'

export type QaSection = PublishedParagraph & {
  type: 'paragraph--q_a_section'
  header: string
  intro: string
  displayAccordion: boolean
  questions: FormattedParagraph[]
}

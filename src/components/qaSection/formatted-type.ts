import { FormattedParagraph } from '@/lib/drupal/queries'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type QaSection = PublishedParagraph & {
  type: 'paragraph--q_a_section'
  header: string
  intro: string
  displayAccordion: boolean
  questions: FormattedParagraph[]
}

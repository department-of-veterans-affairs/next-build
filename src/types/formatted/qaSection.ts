import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from './publishedEntity'
import { HeadingLevel } from './headingElement'

export type QaSection = PublishedParagraph & {
  header: string
  intro: string
  displayAccordion: boolean
  questions: FormattedParagraph[]
  type: 'paragraph--q_a_section' | 'paragraph--q_a_group'
  headerTagLevel?: HeadingLevel
}

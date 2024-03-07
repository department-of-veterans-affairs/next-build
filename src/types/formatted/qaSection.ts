import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from './publishedEntity'

export type QaSection = PublishedParagraph & {
  header: string
  intro: string
  displayAccordion: boolean
  questions: FormattedParagraph[]
  id: string
  type: string
  headerTagLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

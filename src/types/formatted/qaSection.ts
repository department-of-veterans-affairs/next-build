import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from './publishedEntity'

export type QaSection = PublishedParagraph & {
  header: string
  intro: string
  displayAccordion: boolean
  questions: FormattedParagraph[]
  id: string
  type: string
}

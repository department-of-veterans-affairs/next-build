import { PublishedParagraph } from './publishedEntity'
import { FormattedParagraph } from '@/data/queries'

type QaGroupQa = {
  question: string
  answers: FormattedParagraph[]
  type: string
  id: string
}

export type QaGroup = PublishedParagraph & {
  questions: QaGroupQa[]
  header: string
  displayAccordion: boolean
  intro: string
}

import { PublishedParagraph } from './publishedEntity'
import { FormattedParagraph } from '@/data/queries'

//Todo, this should be removed when the question_answer formatter is complete
export type QaGroupQa = {
  type: 'node--q_a'
  question: string
  answers: FormattedParagraph[]
  id: string
}

export type QaGroup = PublishedParagraph & {
  type: 'paragraph--q_a_group'
  questions: QaGroupQa[]
  header: string
  displayAccordion: boolean
  intro: string
}

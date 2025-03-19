import { FormattedParagraph } from '@/data/queries'
import { PublishedParagraph } from './publishedEntity'
import { Wysiwyg } from './wysiwyg'

export type QaSection = PublishedParagraph & {
  type: 'paragraph--q_a_section'
  header: string
  intro: string
  displayAccordion: boolean
  questions: FormattedParagraph[]
}

export type CCQaSection = PublishedParagraph & {
  type: 'paragraph--q_a_section'
  header: string
  intro: string
  displayAccordion: boolean
  questions: {
    type: 'paragraph--qa_group'
    id: string
    question: string
    answers: Wysiwyg[]
    header: string
  }[]
}

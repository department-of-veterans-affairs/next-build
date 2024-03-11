import { Wysiwyg as FormattedWysiwyg } from './wysiwyg'
import { PublishedParagraph } from './publishedEntity'
import { FormattedParagraph } from '@/data/queries'

type QaGroupQa = {
  title: string
  answer: FormattedParagraph
}

export type QaGroup = PublishedParagraph & {
  questions: QaGroupQa[]
  header: string
  displayAccordion: boolean
  intro: string
}

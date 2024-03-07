import { Wysiwyg as FormattedWysiwyg } from './wysiwyg'

type QaGroupQa = {
  title: string
  answer: FormattedWysiwyg
}

export type QaGroup = {
  questions: QaGroupQa[]
  type: string
  id: string
  header: string
  displayAccordion: boolean
  intro: string
}

export type FormattedCcQa = {
  id: string
  question: string | null
  answers: {
    html: string | null
  }[]
}
export type FormattedCcQaSection = {
  id: string
  header: string | null
  intro: string | null
  displayAccordion: boolean
  questions: FormattedCcQa[]
}

import { CCQA, CCQASection } from '@/types/drupal/paragraph'
import {
  FormattedCcQa,
  FormattedCcQaSection,
} from '@/types/formatted/ccQaSection'

const buildQuestionArray = (questions: CCQA[]): FormattedCcQa[] => {
  if (!questions) return []
  return questions.map((question) => ({
    id: question.target_id,
    question: question.field_question[0]?.value || null,
    answers: [
      {
        html: question.field_answer[0]?.field_wysiwyg[0]?.value || null,
      },
    ],
  }))
}

export const buildFormattedFaqs = (faqs: CCQASection): FormattedCcQaSection => {
  return {
    id: faqs.target_id,
    header: faqs.fetched.field_section_header[0]?.value || null,
    intro: faqs.fetched.field_section_intro[0]?.value || null,
    displayAccordion:
      faqs.fetched.field_accordion_display[0]?.value === '1' || false,
    questions: buildQuestionArray(faqs.fetched.field_questions),
  }
}

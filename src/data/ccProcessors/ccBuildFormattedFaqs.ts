import { CCQA, CCQASection } from '@/types/drupal/paragraph'
import {
  FormattedCcQa,
  FormattedCcQaSection,
} from '@/types/formatted/ccQaSection'
import { FormattingError } from '../errors/formatting'

const buildQuestionArray = (questions: CCQA[]): FormattedCcQa[] => {
  if (!questions) {
    return []
  }
  return questions
    .filter((q) => q)
    .map((question) => ({
      id: question.target_id,
      question: question.field_question?.[0]?.value || null,
      answers: [
        {
          html: question.field_answer?.[0]?.field_wysiwyg[0]?.value || null,
        },
      ],
    }))
}

export const buildFormattedFaqs = (faqs: CCQASection): FormattedCcQaSection => {
  if (!faqs) {
    return null
  }
  if (!faqs?.fetched || !faqs.fetched.field_questions?.length) {
    throw new FormattingError(
      'buildFormattedFaqs: FAQ section is missing or malformed fetched'
    )
  }
  return {
    id: faqs.target_id,
    header: faqs.fetched.field_section_header?.[0]?.value || null,
    intro: faqs.fetched.field_section_intro?.[0]?.value || null,
    displayAccordion:
      faqs.fetched.field_accordion_display?.[0]?.value === '1' || false,
    questions: buildQuestionArray(faqs.fetched.field_questions),
  }
}

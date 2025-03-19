import {
  ParagraphCCVetCenterFaqs,
  ParagraphQaSection,
} from '@/types/drupal/paragraph'
import { PARAGRAPH_RESOURCE_TYPES } from '../../lib/constants/resourceTypes'
import { QaSection } from '@/types/formatted/qaSection'

const buildQuestionArray = (questions) => {
  if (!questions) return []
  return questions.map((question) => ({
    id: question.target_id || null,
    question: question.field_question[0]?.value || null,
    answers: [
      {
        html: question.field_answer[0]?.field_wysiwyg[0]?.value || null,
      },
    ],
    header: question.label || null,
  }))
}

export const buildFormattedFaqs = (
  faqs: ParagraphQaSection | ParagraphCCVetCenterFaqs
) => {
  return {
    type: PARAGRAPH_RESOURCE_TYPES.QA_SECTION as QaSection['type'],
    // @ts-expect-error -- something about this type mapping is off
    id: faqs.target_id,
    header: faqs.fetched.field_section_header[0]?.value || null,
    intro: faqs.fetched.field_section_intro[0]?.value || null,
    displayAccordion:
      Boolean(faqs.fetched.field_accordion_display[0]?.value) || false,
    questions: buildQuestionArray(faqs.fetched.field_questions),
  }
}

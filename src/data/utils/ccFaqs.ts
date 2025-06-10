// Import the FormattedQaSection type
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// This formats centralized content FAQs to match what our QA components are expecting
export const buildFaqs = (faqs) => {
  const buildQuestionArray = (questions) => {
    if (!questions) return []
    return questions.map((question) => ({
      id: question.target_id || null,
      question: question.field_question[0]?.value || null,
      answers: [
        {
          html: question.field_answer[0]?.field_wysiwyg[0]?.processed || null,
        },
      ],
      header: question.label || null,
    }))
  }

  return {
    type: PARAGRAPH_RESOURCE_TYPES.QA_SECTION as FormattedQaSection['type'],
    id: faqs.target_id,
    header: faqs.fetched.field_section_header[0]?.value || null,
    intro: faqs.fetched.field_section_intro[0]?.value || null,
    displayAccordion:
      Boolean(faqs.fetched.field_accordion_display[0]?.value) ?? false,
    questions: buildQuestionArray(faqs.fetched.field_questions),
  }
}

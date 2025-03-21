import { CCQASection } from '@/types/drupal/paragraph'
import { cloneDeep } from 'lodash'
import { buildFormattedFaqs } from '../buildFormattedFaqs'
import mock from '@/mocks/vamcSystemVaPolice.mock.json'
import { FormattingError } from '@/data/errors/formatting'

let mockCCQA: CCQASection

describe('buildFormattedFaqs', () => {
  beforeEach(async () => {
    mockCCQA = cloneDeep(mock.field_cc_faq)
  })

  it('should return a formatted FAQ section', () => {
    const formattedFaq = buildFormattedFaqs(mockCCQA)
    expect(formattedFaq.displayAccordion).toBe(true)
    expect(formattedFaq.header).toBe(
      'Other questions you may have about VA police'
    )
    expect(formattedFaq.intro).toBe(null)
    const length = mockCCQA.fetched.field_questions.length
    expect(formattedFaq.questions.length).toBe(length)
    for (let i = 0; i < length; i++) {
      expect(formattedFaq.questions[i].question).toBe(
        mockCCQA.fetched.field_questions[i].field_question[0].value
      )
      expect(formattedFaq.questions[i].answers[0].html).toBe(
        mockCCQA.fetched.field_questions[i].field_answer[0].field_wysiwyg[0]
          .value
      )
    }
  })

  it('should return null if the FAQ section is not found', () => {
    const formattedFaq = buildFormattedFaqs(null)
    expect(formattedFaq).toBeNull()
  })

  it('should throw FormattingError if the FAQ fetched section is not found', () => {
    expect(() =>
      buildFormattedFaqs({
        fetched: null,
      } as unknown as CCQASection)
    ).toThrow('buildFormattedFaqs: FAQ section is missing or malformed fetched')
  })
})

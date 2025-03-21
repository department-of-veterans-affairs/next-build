/**
 * @jest-environment node
 */

import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { FormattedParagraph, queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystemVaPolice.mock.json'
import { formatter } from '../vamcSystemVaPolice'
import { QaGroup, QaGroupQa } from '@/types/formatted/qaGroup'
import { WysiwygField } from '@/types/formatted/wysiwyg'

const VamcSystemVaPoliceMock: NodeVamcSystemVaPolice = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const formattedVamcSystemVaPolice = formatter(VamcSystemVaPoliceMock)
    expect(formattedVamcSystemVaPolice.type).toBe('node--vamc_system_va_police')
    expect(typeof formattedVamcSystemVaPolice.title).toBe('string')
    expect(formattedVamcSystemVaPolice.field_cc_faq.displayAccordion).toBe(true)
    expect(formattedVamcSystemVaPolice.field_cc_faq.header).toBeDefined()
    expect(formattedVamcSystemVaPolice.field_cc_faq.questions).toBeDefined()
    expect(
      formattedVamcSystemVaPolice.field_cc_faq.questions.length
    ).toBeGreaterThan(0)
    expect(
      typeof formattedVamcSystemVaPolice.field_cc_faq.questions[0].question
    ).toBe('string')
    expect(
      typeof (
        formattedVamcSystemVaPolice.field_cc_faq.questions[0]
          .answers[0] as WysiwygField
      ).html
    ).toBe('string')
  })
})

describe('VamcSystemVaPolice formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vamc_system_va_police', VamcSystemVaPoliceMock)
    ).toMatchSnapshot()
  })
})

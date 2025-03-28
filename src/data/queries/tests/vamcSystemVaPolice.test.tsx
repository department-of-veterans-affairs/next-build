/**
 * @jest-environment node
 */

import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystemVaPolice.mock.json'
import { formatter, params } from '../vamcSystemVaPolice'
import { WysiwygField } from '@/types/formatted/wysiwyg'

const VamcSystemVaPoliceMock: NodeVamcSystemVaPolice = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('just the params function returns the correct params', () => {
    const parameters = params()
    expect(parameters.getQueryObject()).toEqual({
      fields: {},
      include: 'field_phone_numbers_paragraph,field_office',
      filter: {
        published: '1',
      },
      sort: [],
    })
  })

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
    expect(
      formattedVamcSystemVaPolice.field_phone_numbers_paragraph
    ).toBeDefined()
    expect(
      formattedVamcSystemVaPolice.field_phone_numbers_paragraph.number
    ).toBeDefined()
  })
})

describe('VamcSystemVaPolice formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vamc_system_va_police', VamcSystemVaPoliceMock)
    ).toMatchSnapshot()
  })
})

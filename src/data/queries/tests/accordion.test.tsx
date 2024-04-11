/**
 * @jest-environment node
 */

import { ParagraphAccordion } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/accordion.mock.json'

const AccordionMock: ParagraphAccordion = mockData

describe('Accordion formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData(
      'paragraph--basic_accordion',
      AccordionMock
    )
    expect(formattedData).toMatchSnapshot()
  })

  test('handles null field_header gracefully', () => {
    const accordionMockWithNullHeader: ParagraphAccordion = {
      ...mockData,
      field_header: null,
    }

    const formattedData = queries.formatData(
      'paragraph--basic_accordion',
      accordionMockWithNullHeader
    )
    expect(formattedData.header).toBeNull()
    expect(formattedData.html).toBe(
      accordionMockWithNullHeader.field_rich_wysiwyg.processed
    )
  })
})

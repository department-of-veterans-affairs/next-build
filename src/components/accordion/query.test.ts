/**
 * @jest-environment node
 */

import { ParagraphAccordion } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/accordion/mock.json'

const AccordionMock = mockData as ParagraphAccordion

describe('Accordion formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData(
      'paragraph--basic_accordion',
      AccordionMock
    )
    expect(formattedData).toMatchSnapshot()
  })

  test('handles null field_header gracefully', () => {
    const accordionMockWithNullHeader = {
      ...mockData,
      field_header: null,
    } as ParagraphAccordion

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

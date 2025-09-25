/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { ParagraphEmailContact } from '@/types/drupal/paragraph'
import mockData from '@/components/emailContact/mock.json'

const emailMock = mockData as ParagraphEmailContact

describe('paragraph--email_contact formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--email_contact', emailMock)
    ).toMatchSnapshot()
  })
  test('handles null field_email_label gracefully', () => {
    const emailContactWithNullLabel = {
      ...emailMock,
      field_email_label: null,
    } as ParagraphEmailContact

    const formattedData = queries.formatData(
      'paragraph--email_contact',
      emailContactWithNullLabel
    )
    expect(formattedData.label).toBeNull()
  })

  test('handles null field_email_address gracefully', () => {
    const emailContactWithNullAddress = {
      ...emailMock,
      field_email_address: null,
    } as ParagraphEmailContact

    const formattedData = queries.formatData(
      'paragraph--email_contact',
      emailContactWithNullAddress
    )
    expect(formattedData.address).toBeNull()
  })
})

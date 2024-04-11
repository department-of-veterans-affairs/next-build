/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { ParagraphEmailContact } from '@/types/drupal/paragraph'
import mockData from '@/mocks/emailContact.mock.json'

const emailMock: ParagraphEmailContact = mockData

describe('paragraph--email_contact formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--email_contact', emailMock)
    ).toMatchSnapshot()
  })
  test('handles null field_email_label gracefully', () => {
    const emailContactWithNullLabel: ParagraphEmailContact = {
      ...emailMock,
      field_email_label: null,
    }

    const formattedData = queries.formatData(
      'paragraph--email_contact',
      emailContactWithNullLabel
    )
    expect(formattedData.label).toBeNull()
  })

  test('handles null field_email_address gracefully', () => {
    const emailContactWithNullAddress: ParagraphEmailContact = {
      ...emailMock,
      field_email_address: null,
    }

    const formattedData = queries.formatData(
      'paragraph--email_contact',
      emailContactWithNullAddress
    )
    expect(formattedData.address).toBeNull()
  })
})

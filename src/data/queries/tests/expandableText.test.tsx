/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { ParagraphExpandableText } from '@/types/drupal/paragraph'
import mockData from '@/mocks/expandableText.mock.json'

const expandableTextMock: ParagraphExpandableText = mockData

describe('paragraph--expandable_text formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--expandable_text', expandableTextMock)
    ).toMatchSnapshot()
  })
  test('handles null field_text_expander gracefully', () => {
    const modifiedMock = { ...expandableTextMock, field_text_expander: null }
    const formattedData = queries.formatData(
      'paragraph--expandable_text',
      modifiedMock
    )

    expect(formattedData.header).toBeNull()
  })

  test('handles undefined field_wysiwyg gracefully', () => {
    const modifiedMock = { ...expandableTextMock, field_wysiwyg: undefined }
    const formattedData = queries.formatData(
      'paragraph--expandable_text',
      modifiedMock
    )

    expect(formattedData.text).toBeNull()
  })
})

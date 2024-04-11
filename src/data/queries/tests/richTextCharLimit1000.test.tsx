/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { ParagraphRichTextCharLimit1000 } from '@/types/drupal/paragraph'
import mockData from '@/mocks/richTextCharLimit1000.mock.json'

const richTextMock: ParagraphRichTextCharLimit1000[] = mockData

describe('paragraph--wysiwyg formatData', () => {
  test('outputs formatted data', () => {
    expect(
      richTextMock.map((mock) => {
        return queries.formatData('paragraph--rich_text_char_limit_1000', mock)
      })
    ).toMatchSnapshot()
  })
})

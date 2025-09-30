/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { ParagraphWysiwyg } from '@/types/drupal/paragraph'
import { ParagraphRichTextCharLimit1000 } from '@/types/drupal/paragraph'
import wysiwygMockData from './mock.json'
import richTextMockData from './mock.richTextCharLimit1000.json'

const wysiwygMock = wysiwygMockData as ParagraphWysiwyg[]
const richTextMock = richTextMockData as ParagraphRichTextCharLimit1000[]

describe('paragraph--wysiwyg formatData', () => {
  test('outputs formatted data', () => {
    expect(
      wysiwygMock.map((mock) => {
        return queries.formatData('paragraph--wysiwyg', mock)
      })
    ).toMatchSnapshot()
  })
})

describe('paragraph--rich_text_char_limit_1000 formatData', () => {
  test('outputs formatted data', () => {
    expect(
      richTextMock.map((mock) => {
        return queries.formatData('paragraph--rich_text_char_limit_1000', mock)
      })
    ).toMatchSnapshot()
  })
})

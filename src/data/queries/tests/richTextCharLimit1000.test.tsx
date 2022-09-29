import { queries } from '@/data/queries'
import { ParagraphRichTextCharLimit1000 } from '@/types/dataTypes/drupal/paragraph'
import mockData from '@/mocks/richTextCharLimit1000.mock.json'

const richTextMock: ParagraphRichTextCharLimit1000[] = mockData

describe('paragraph--wysiwyg formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)

    expect(
      richTextMock.map((mock) => {
        return queries.formatData('paragraph--rich_text_char_limit_1000', mock)
      })
    ).toMatchSnapshot()
  })
})

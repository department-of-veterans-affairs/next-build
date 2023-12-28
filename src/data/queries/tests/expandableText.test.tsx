import { queries } from '@/data/queries'
import { ParagraphExpandableText } from '@/types/drupal/paragraph'
import mockData from '@/mocks/expandableText.mock.json'

const expandableTextMock: ParagraphExpandableText[] = mockData

describe('paragraph--expandable_text formatData', () => {
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
      queries.formatData('paragraph--expandable_text', expandableTextMock)
    ).toMatchSnapshot()
  })
})

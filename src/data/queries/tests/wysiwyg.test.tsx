import { queries } from '@/data/queries'
import { ParagraphWysiwyg } from '@/types/drupal/paragraph'
import mockData from '@/mocks/wysiwyg.mock.json'

const wysiwygMock: ParagraphWysiwyg[] = mockData

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
      wysiwygMock.map((mock) => {
        return queries.formatData('paragraph--wysiwyg', mock)
      })
    ).toMatchSnapshot()
  })
})

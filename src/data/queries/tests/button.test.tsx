import { queries } from '@/data/queries'
import { ParagraphButton } from '@/types/dataTypes/drupal/paragraph'
import mockData from '@/mocks/button.mock.json'

const buttonMock: ParagraphButton[] = mockData

describe('paragraph--button formatData', () => {
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
      buttonMock.map((mock) => {
        return queries.formatData('paragraph--button', mock)
      })
    ).toMatchSnapshot()
  })
})

import { ParagraphAlert } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/alert.mock.js'

const AlertMock: ParagraphAlert = mockResponse

describe('alert formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)

    expect(queries.formatData('paragraph--alert', AlertMock)).toMatchSnapshot()
  })
})

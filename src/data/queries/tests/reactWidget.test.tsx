import { ParagraphReactWidget } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/reactWidget.mock'

const ReactWidgetMock: ParagraphReactWidget = mockResponse

describe('React widget formatData', () => {
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
      queries.formatData('paragraph--react_widget', ReactWidgetMock)
    ).toMatchSnapshot()
  })
})

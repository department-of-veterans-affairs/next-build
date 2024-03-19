import { ParagraphProcessList } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/processList.mock'

const ProcessListMock: ParagraphProcessList = mockResponse

describe('ProcessList formatData', () => {
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
      queries.formatData('paragraph--process', ProcessListMock)
    ).toMatchSnapshot()
  })
})

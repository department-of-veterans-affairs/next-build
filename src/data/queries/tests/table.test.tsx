import { ParagraphTable } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/table.mock'

const TableMock: ParagraphTable = mockResponse

describe('table formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)

    expect(queries.formatData('paragraph--table', TableMock)).toMatchSnapshot()
  })
})

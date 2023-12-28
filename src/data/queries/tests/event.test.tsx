import { NodeEvent } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/event.mock.json'

const nodeEventMock: NodeEvent = mockData

describe('node--event formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)
    const formattedData = queries.formatData('node--event', nodeEventMock)
    expect(formattedData).toMatchSnapshot()
  })
})

import { NodeEvent } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/event.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const nodeEventMock: NodeEvent = mockData

describe(`${RESOURCE_TYPES.EVENT} formatData`, () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)
    const formattedData = queries.formatData(
      RESOURCE_TYPES.EVENT,
      nodeEventMock
    )
    expect(formattedData).toMatchSnapshot()
  })
})

import { NodeEvent } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/event.mock.json'

const nodeEventMock: NodeEvent = mockData

describe('event teaser formatData', () => {
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
      queries.formatData('node--event--teaser', nodeEventMock)
    ).toMatchSnapshot()
  })
})

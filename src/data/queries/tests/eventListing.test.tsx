import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/eventListing.mock.js'
import mockEventData from '@/mocks/event.mock.json'

const EventListingMock: NodeEventListing = mockResponse
const EventMock: NodeEvent[] = [mockEventData]

describe('EventListing formatData', () => {
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
      queries.formatData('node--event_listing', {
        entity: EventListingMock,
        events: EventMock,
        menu: { items: [], tree: [] },
        totalItems: EventMock.length,
        totalPages: 1,
      })
    ).toMatchSnapshot()
  })
})

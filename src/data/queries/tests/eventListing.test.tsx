import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/eventListing.mock.js'
import mockEventData from '@/mocks/event.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const EventListingMock: NodeEventListing = mockResponse
const EventMock: NodeEvent[] = [mockEventData]

describe(`${RESOURCE_TYPES.EVENT_LISTING} formatData`, () => {
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
      queries.formatData(RESOURCE_TYPES.EVENT_LISTING, {
        entity: EventListingMock,
        events: EventMock,
        menu: { items: [], tree: [] },
        totalItems: EventMock.length,
        totalPages: 1,
      })
    ).toMatchSnapshot()
  })
})

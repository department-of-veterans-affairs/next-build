import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/eventListing.mock.json'
import menuMockData from '@/mocks/facilitySidebarMenu.mock.json'
import mockEventData from '@/mocks/event.mock.json'

const EventListingMock: NodeEventListing = mockData
const EventMock: NodeEvent[] = [ mockEventData ]
const MenuMock = menuMockData

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
      queries.formatData('node--event_listing', { entity: EventListingMock, events: EventMock, menu: MenuMock })
    ).toMatchSnapshot()
  })
})

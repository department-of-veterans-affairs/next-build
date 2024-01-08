import { NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/EventListing.mock.json'

const EventListingMock: NodeEventListing = mockData

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
      queries.formatData('node--event_listing', EventListingMock)
    ).toMatchSnapshot()
  })
})

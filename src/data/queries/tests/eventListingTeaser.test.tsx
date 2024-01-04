import { EventListingTeaser } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/EventListingTeaser.mock.json'

const EventListingTeaserMock: EventListingTeaser = mockData

describe('EventListingTeaser formatData', () => {
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
      queries.formatData('node--event_listing_teaser', EventListingTeaserMock)
    ).toMatchSnapshot()
  })
})

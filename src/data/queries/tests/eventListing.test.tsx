/**
 * @jest-environment node
 */

import { NodeEvent, NodeEventListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/eventListing.mock.js'
import mockEventData from '@/products/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../eventListing'

const EventListingMock: NodeEventListing = mockResponse
const EventMock: NodeEvent[] = [mockEventData]

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_office/)
  })
})

describe(`${RESOURCE_TYPES.EVENT_LISTING} formatData`, () => {
  test('outputs formatted data', () => {
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

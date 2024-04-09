/**
 * @jest-environment node
 */

import { NodeEvent } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/event.mock.json'
import { params } from '../eventTeaser'

const nodeEventMock: NodeEvent = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_listing,field_administration,field_facility_location/
    )
  })
})

describe('event teaser formatData', () => {
  test('outputs formatted data for all fields', () => {
    const formattedData = queries.formatData(
      'node--event--teaser',
      nodeEventMock
    )
    expect(formattedData.entityId).toBe(nodeEventMock.id)
    expect(formattedData.title).toBe(nodeEventMock.title)
    expect(formattedData.fieldDescription).toBe(nodeEventMock.field_description)
  })

  test('handles missing optional fields gracefully', () => {
    const eventWithMissingFields = {
      ...nodeEventMock,
      field_address: undefined,
      field_facility_location: undefined,
    }
    const formattedDataWithMissingFields = queries.formatData(
      'node--event--teaser',
      eventWithMissingFields
    )
    expect(formattedDataWithMissingFields.fieldAddress.addressLine1).toBeNull()
    expect(formattedDataWithMissingFields.fieldFacilityLocation).toBeNull()
  })

  test('handles partial field_facility_location data correctly', () => {
    const eventWithPartialFacilityLocation: Partial<NodeEvent> = {
      ...nodeEventMock,
      field_facility_location: {
        ...nodeEventMock.field_facility_location,
        field_address: {
          langcode: 'en',
          country_code: 'US',
          administrative_area: 'VA',
          locality: 'Richmond',
          address_line1: '123 Main St',
          address_line2: 'Suite 100',
          postal_code: '23220',
        },
      },
    }

    const formattedData = queries.formatData(
      'node--event--teaser',
      eventWithPartialFacilityLocation as NodeEvent
    )
    expect(
      formattedData.fieldFacilityLocation?.entity.fieldAddress
        .administrativeArea
    ).toBe('VA')
    expect(
      formattedData.fieldFacilityLocation?.entity.fieldAddress.addressLine1
    ).toBe('123 Main St')
  })

  test('handles fully online events without a physical location', () => {
    const onlineEventMock = {
      ...nodeEventMock,
      field_location_type: 'online',
      field_url_of_an_online_event: {
        uri: '/example',
        title: 'test',
        options: [],
      },
      field_facility_location: undefined,
    }
    const formattedData = queries.formatData(
      'node--event--teaser',
      onlineEventMock
    )
    expect(formattedData.fieldUrlOfAnOnlineEvent).toBe(
      onlineEventMock.field_url_of_an_online_event
    )
    expect(formattedData.fieldFacilityLocation).toBeNull()
  })
})

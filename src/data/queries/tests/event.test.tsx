/**
 * @jest-environment node
 */

import { NodeEvent } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/event.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../event'

const nodeEventMock: NodeEvent = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    const expectedFields = [
      'field_listing',
      'field_administration',
      'field_facility_location',
      'field_media',
    ]

    expectedFields.forEach((field) => {
      expect(queryString).toMatch(new RegExp(`include=.*${field}`))
    })
  })
})

describe(`${RESOURCE_TYPES.EVENT} formatData`, () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData(
      RESOURCE_TYPES.EVENT,
      nodeEventMock
    )
    expect(formattedData).toMatchSnapshot()
  })
})

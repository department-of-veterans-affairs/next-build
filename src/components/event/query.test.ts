/**
 * @jest-environment node
 */

import { NodeEvent } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params, formatter } from './query'

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

describe('event formatter applies content formatting', () => {
  test('applies getHtmlFromField to body', () => {
    const mockWithH2 = {
      ...nodeEventMock,
      field_body: {
        value: '<h2>Test Heading</h2><p>Some content</p>',
        format: 'rich_text',
        processed: '<h2>Test Heading</h2><p>Some content</p>',
      },
    }
    const formattedData = formatter(mockWithH2)
    // Verify H2 IDs are added (proves formatting is applied)
    expect(formattedData.body).toContain('id="test-heading"')
  })

  test('applies getHtmlFromField to additionalInfo', () => {
    const mockWithH2 = {
      ...nodeEventMock,
      field_additional_information_abo: {
        value: '<h2>Additional Info Heading</h2><p>Some content</p>',
        format: 'rich_text',
        processed: '<h2>Additional Info Heading</h2><p>Some content</p>',
      },
    }
    const formattedData = formatter(mockWithH2)
    // Verify H2 IDs are added (proves formatting is applied)
    expect(formattedData.additionalInfo).toContain('id="additional-info-heading"')
  })
})

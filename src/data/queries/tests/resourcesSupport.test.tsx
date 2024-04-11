/**
 * @jest-environment node
 */

import { NodeSupportResourcesDetailPage } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/resourcesSupport.mock'
import { params } from '../resourcesSupport'

//eslint-disable-next-line
const MockSupportResources: NodeSupportResourcesDetailPage | any = mockResponse

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())

    const expectedIncludes = [
      'field_alert_single',
      'field_buttons',
      'field_content_block',
      'field_tags',
      'field_related_information',
      'field_contact_information',
    ]

    expectedIncludes.forEach((include) => {
      expect(queryString).toMatch(new RegExp(`include=.*${include}`))
    })
  })
})

describe('Resources Support formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--support_resources_detail_page',
        MockSupportResources
      )
    ).toMatchSnapshot()
  })
  test('handles absence of optional fields gracefully', () => {
    const modifiedMock = {
      ...MockSupportResources,
      field_alert_single: null,
      field_buttons: [],
      field_content_block: [],
      field_tags: null,
      field_contact_information: null,
      field_related_benefit_hubs: [],
    }
    const formattedData = queries.formatData(
      'node--support_resources_detail_page',
      modifiedMock
    )

    expect(formattedData.alert).toBeNull()
    expect(formattedData.buttons).toEqual([])
    expect(formattedData.mainContent).toEqual([])
    expect(formattedData.tags).toBeNull()
    expect(formattedData.contactInformation).toBeNull()
    expect(formattedData.benefitsHubLinks).toEqual([])
  })
})

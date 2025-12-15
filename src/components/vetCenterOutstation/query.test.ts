/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { params } from './query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockOutstation from './mock.json'
import { NodeVetCenterOutstation } from '@/types/drupal/node'

const outstationMock = mockOutstation as unknown as NodeVetCenterOutstation

describe('DrupalJsonApiParams configuration', () => {
  it('should include the correct fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      'include=field_media,field_media.image,field_administration,field_health_services,field_health_services.field_service_name_and_descripti'
    )
  })
})

describe('VetCenterOutstation formatData', () => {
  it('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.VET_CENTER_OUTSTATION, outstationMock)
    ).toMatchSnapshot()
  })
})

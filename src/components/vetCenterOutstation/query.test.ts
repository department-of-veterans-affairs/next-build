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
    expect(queryString).toContain('field_media')
    expect(queryString).toContain('field_media.image')
    expect(queryString).toContain('field_administration')
    expect(queryString).toContain('field_prepare_for_visit')
    expect(queryString).toContain('field_vet_center_feature_content')
    expect(queryString).toContain('field_health_services')
  })
})

describe('VetCenterOutstation formatData', () => {
  it('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.VET_CENTER_OUTSTATION, outstationMock)
    ).toMatchSnapshot()
  })
})

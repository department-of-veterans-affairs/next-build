/**
 * @jest-environment node
 */

import { NodeVetCenter } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/vetCenter.mock'
import { params } from '../vetCenterOutstation'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const VetCenterMock: NodeVetCenter = mockResponse

describe('DrupalJsonApiParams configuration', () => {
  it('should include the correct fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      'include=field_media,field_media.image,field_administration,field_prepare_for_visit,field_vet_center_feature_content,field_vet_center_feature_content.field_cta,field_health_services,field_health_services.field_service_name_and_descripti'
    )
  })
})

describe('VetCenterOutstation formatData', () => {
  it('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.VET_CENTER_OUTSTATION, VetCenterMock)
    ).toMatchSnapshot()
  })
})

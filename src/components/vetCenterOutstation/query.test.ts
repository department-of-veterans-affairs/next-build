/**
 * @jest-environment node
 */

import { NodeVetCenter } from '@/types/drupal/node'
import { mockResponse } from '../vetCenter/mock'
import { params, formatter } from './query'

const VetCenterMock = mockResponse as NodeVetCenter

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
    expect(formatter(VetCenterMock)).toMatchSnapshot()
  })

  it('handles ccFeaturedContent not getting fetched', () => {
    expect(
      formatter({
        ...VetCenterMock,
        // @ts-expect-error Something somewhere along the way apparently adds
        // this field, but it's not in the type definition.
        field_cc_vet_center_featured_con: { fetched: false },
      })
    ).toMatchSnapshot()
  })
})

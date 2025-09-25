/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/vbaFacility/mock.json'
import mockServicesData from './vbaFacilityService.mock.json'
import { params } from './query'
import { NodeVbaFacility, NodeVbaService } from '@/types/drupal/node'

const VbaFacilityMock = {
  entity: mockData as NodeVbaFacility,
  services: [
    { ...(mockServicesData as NodeVbaService), field_office: mockData },
  ],
}

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_media,field_media.image,field_prepare_for_visit,field_local_spotlight,field_local_spotlight.field_cta/
    )
  })
})

describe('VbaFacility formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vba_facility', VbaFacilityMock)
    ).toMatchSnapshot()
  })
})

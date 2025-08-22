/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vbaFacility.mock.json'
import mockServicesData from '@/mocks/vbaFacilityService.mock.json'
import { params } from '../vbaFacility'

const VbaFacilityMock = {
  entity: mockData,
  services: [{ ...mockServicesData, field_office: mockData }],
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

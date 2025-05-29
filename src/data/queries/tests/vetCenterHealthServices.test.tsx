/**
 * @jest-environment node
 */

import { VetCenterFieldHealthServicesArray } from '@/types/drupal/field_type'
import { queries } from '@/data/queries'
import mockResponse from '@/mocks/vetCenterHealthServices.mock.json'
import { params } from '../vetCenterHealthServices'

const HealthServicesMock: VetCenterFieldHealthServicesArray = mockResponse

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_service_name_and_descripti/)
  })
})

describe('healthServices formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--vet_center_facility_health_servi',
        HealthServicesMock
      )
    ).toMatchSnapshot()
  })
  test('handles null properties within field_service_name_and_descripti', () => {
    const modifiedMock = HealthServicesMock.map((service) => ({
      ...service,
      field_service_name_and_descripti: {
        ...service.field_service_name_and_descripti,
        name: null,
        field_vet_center_type_of_care: null,
        field_vet_center_friendly_name: null,
        field_also_known_as: null,
        field_vet_center_com_conditions: null,
        field_commonly_treated_condition: null,
        field_vet_center_service_descrip: null,
        description: { processed: null },
      },
      field_body: null,
    }))

    const formattedData = queries.formatData(
      'node--vet_center_facility_health_servi',
      modifiedMock
    )

    formattedData.forEach((service) => {
      expect(service.name).toBeNull()
      expect(service.vetCenterTypeOfCare).toBeNull()
      expect(service.vetCenterFriendlyName).toBeNull()
      expect(service.alsoKnownAs).toBeNull()
      expect(service.vetCenterComConditions).toBeNull()
      expect(service.commonlyTreatedCondition).toBeNull()
      expect(service.vetCenterServiceDescription).toBeNull()
      expect(service.description).toBeNull()
      expect(service.body).toBeNull()
    })
  })
  test('returns null for items without field_service_name_and_descripti', () => {
    const modifiedMock = HealthServicesMock.map((item) => ({
      ...item,
      field_service_name_and_descripti: null,
    }))

    const formattedData = queries.formatData(
      'node--vet_center_facility_health_servi',
      modifiedMock
    )

    formattedData.forEach((item) => {
      expect(item).toBeNull()
    })
  })
})

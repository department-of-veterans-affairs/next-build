/**
 * @jest-environment node
 */

import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { Administration } from '@/components/administration/formatted-type'
import {
  sortServiceLocations,
  formatHealthService,
  groupHealthServicesByType,
} from './query-utils'
import { HealthServiceLocation, HealthService } from './formatted-type'
import { createMockServiceDes } from './mockServiceDes'
import mockFacility from '@/components/vamcFacility/mock'

// Mock getHtmlFromField
jest.mock('@/lib/utils/getHtmlFromField', () => ({
  getHtmlFromField: jest.fn((field) => field?.processed || ''),
}))

// Helper to create a facility location mock based on the real mock
const createFacilityLocation = (
  overrides: Partial<NodeHealthCareLocalFacility> = {}
): NodeHealthCareLocalFacility => {
  return {
    ...mockFacility,
    ...overrides,
  }
}

describe('formatHealthServiceLocations (tested via formatHealthService)', () => {
  const mockAdministration: Administration = {
    entityId: 1,
    name: 'Test Administration',
  }

  it('should filter out services without status', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations: [
        { id: '1', title: 'Location 1', path: '/loc1' },
        { id: '2', title: 'Location 2', path: '/loc2' },
        { id: '3', title: 'Location 3', path: '/loc3' },
      ],
    })
    // Set facility locations (mock sets them to null by default)
    service.field_local_health_care_service_.forEach((localService, index) => {
      localService.field_facility_location = createFacilityLocation({
        id: `facility-${index + 1}`,
        title: `Location ${index + 1}`,
        path: { alias: `/loc${index + 1}`, pid: 1, langcode: 'en' },
        field_main_location: false,
        field_facility_classification: '',
        field_mobile: false,
      })
    })
    // Set one service to have status: false
    if (service.field_local_health_care_service_[1]) {
      service.field_local_health_care_service_[1].status = false
    }

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations).toHaveLength(2)
  })

  it('should filter out services without facility location', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations: [
        { id: '1', title: 'Location 1', path: '/loc1' },
        { id: '2', title: 'Location 2', path: '/loc2' },
        { id: '3', title: 'Location 3', path: '/loc3' },
      ],
    })
    // Set facility locations for 2 services (mock sets them to null by default)
    service.field_local_health_care_service_.forEach((localService, index) => {
      if (index > 0) {
        // Skip first one to test filtering
        localService.field_facility_location = createFacilityLocation({
          id: `facility-${index + 1}`,
          title: `Location ${index + 1}`,
          path: { alias: `/loc${index + 1}`, pid: 1, langcode: 'en' },
          field_main_location: false,
          field_facility_classification: '',
          field_mobile: false,
        })
      }
    })

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations).toHaveLength(2)
  })

  it('should format location data correctly', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations: [
        {
          id: '123',
          title: 'Main Clinic',
          path: '/main-clinic',
          isMainLocation: true,
          facilityClassification: '8',
          isMobile: false,
        },
      ],
    })
    // Set facility location (mock sets it to null by default)
    if (service.field_local_health_care_service_[0]) {
      service.field_local_health_care_service_[0].field_facility_location =
        createFacilityLocation({
          id: 'facility-123',
          title: 'Main Clinic',
          path: { alias: '/main-clinic', pid: 1, langcode: 'en' },
          field_main_location: true,
          field_facility_classification: '8',
          field_mobile: false,
        })
    }

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations).toHaveLength(1)
    expect(result?.locations[0]).toEqual({
      id: '123',
      title: 'Main Clinic',
      path: '/main-clinic',
      isMainLocation: true,
      facilityClassification: '8',
      isMobile: false,
    })
  })

  it('should handle missing nid gracefully', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations: [{ id: '1', title: 'Location 1', path: '/loc1' }],
    })
    // Set facility location (mock sets it to null by default)
    if (service.field_local_health_care_service_[0]) {
      service.field_local_health_care_service_[0].field_facility_location =
        createFacilityLocation({
          id: 'facility-1',
          title: 'Location 1',
          path: { alias: '/loc1', pid: 1, langcode: 'en' },
          field_main_location: false,
          field_facility_classification: '',
          field_mobile: false,
        })
      // Set nid to undefined
      service.field_local_health_care_service_[0].drupal_internal__nid =
        undefined
    }

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations[0].id).toBe('')
  })

  it('should handle missing title and path gracefully', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations: [{ id: '1', title: 'Location 1', path: '/loc1' }],
    })
    // Set facility location with undefined title and path
    if (service.field_local_health_care_service_[0]) {
      service.field_local_health_care_service_[0].field_facility_location =
        createFacilityLocation({
          id: 'facility-1',
          title: undefined,
          path: { alias: undefined, pid: 1, langcode: 'en' },
          field_main_location: false,
          field_facility_classification: '',
          field_mobile: false,
        })
    }

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations[0].title).toBe('')
    expect(result?.locations[0].path).toBe('')
  })

  it('should sort locations correctly', () => {
    const locations = [
      {
        id: '1',
        title: 'Zebra Clinic',
        path: '/zebra',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '2',
        title: 'Main Clinic',
        path: '/main',
        isMainLocation: true,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '3',
        title: 'Alpha Clinic',
        path: '/alpha',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
    ]
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations,
    })
    // Set facility locations (mock sets them to null by default)
    service.field_local_health_care_service_.forEach((localService, index) => {
      localService.field_facility_location = createFacilityLocation({
        id: `facility-${locations[index].id}`,
        title: locations[index].title,
        path: { alias: locations[index].path, pid: 1, langcode: 'en' },
        field_main_location: locations[index].isMainLocation,
        field_facility_classification: locations[index].facilityClassification,
        field_mobile: locations[index].isMobile,
      })
    })

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations[0].title).toBe('Main Clinic') // Main location first
    expect(result?.locations[1].title).toBe('Alpha Clinic') // Then alphabetically
    expect(result?.locations[2].title).toBe('Zebra Clinic')
  })
})

describe('sortServiceLocations', () => {
  it('should sort main locations first', () => {
    const locations: HealthServiceLocation[] = [
      {
        id: '1',
        title: 'B',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '2',
        title: 'A',
        path: '',
        isMainLocation: true,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '3',
        title: 'C',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
    ]

    const sorted = [...locations].sort(sortServiceLocations)
    expect(sorted[0].id).toBe('2') // Main location first
  })

  it('should sort regular clinics before CLCs and DOMs', () => {
    const locations: HealthServiceLocation[] = [
      {
        id: '1',
        title: 'CLC',
        path: '',
        isMainLocation: false,
        facilityClassification: '7',
        isMobile: false,
      },
      {
        id: '2',
        title: 'Regular',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '3',
        title: 'DOM',
        path: '',
        isMainLocation: false,
        facilityClassification: '8',
        isMobile: false,
      },
    ]

    const sorted = [...locations].sort(sortServiceLocations)
    expect(sorted[0].id).toBe('2') // Regular clinic first
    expect(sorted[1].id).toBe('1') // Then CLC
    expect(sorted[2].id).toBe('3') // Then DOM
  })

  it('should sort mobile clinics last', () => {
    const locations: HealthServiceLocation[] = [
      {
        id: '1',
        title: 'Mobile',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: true,
      },
      {
        id: '2',
        title: 'Regular',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '3',
        title: 'CLC',
        path: '',
        isMainLocation: false,
        facilityClassification: '7',
        isMobile: false,
      },
    ]

    const sorted = [...locations].sort(sortServiceLocations)
    expect(sorted[sorted.length - 1].id).toBe('1') // Mobile last
  })

  it('should sort alphabetically within same priority', () => {
    const locations: HealthServiceLocation[] = [
      {
        id: '1',
        title: 'Zebra',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '2',
        title: 'Alpha',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: '3',
        title: 'Beta',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
    ]

    const sorted = [...locations].sort(sortServiceLocations)
    expect(sorted[0].title).toBe('Alpha')
    expect(sorted[1].title).toBe('Beta')
    expect(sorted[2].title).toBe('Zebra')
  })

  it('should handle complete sorting order: main > regular > CLC/DOM > mobile', () => {
    const locations: HealthServiceLocation[] = [
      {
        id: 'mobile',
        title: 'Mobile',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: true,
      },
      {
        id: 'main',
        title: 'Main',
        path: '',
        isMainLocation: true,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: 'dom',
        title: 'DOM',
        path: '',
        isMainLocation: false,
        facilityClassification: '8',
        isMobile: false,
      },
      {
        id: 'regular',
        title: 'Regular',
        path: '',
        isMainLocation: false,
        facilityClassification: '',
        isMobile: false,
      },
      {
        id: 'clc',
        title: 'CLC',
        path: '',
        isMainLocation: false,
        facilityClassification: '7',
        isMobile: false,
      },
    ]

    const sorted = [...locations].sort(sortServiceLocations)
    expect(sorted[0].id).toBe('main')
    expect(sorted[1].id).toBe('regular')
    expect(sorted[2].id).toBe('clc')
    expect(sorted[3].id).toBe('dom')
    expect(sorted[4].id).toBe('mobile')
  })
})

describe('formatHealthService', () => {
  const mockAdministration: Administration = {
    entityId: 1,
    name: 'Test Administration',
  }

  it('should return null when taxonomy is null (archived service)', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
    })
    service.field_service_name_and_descripti = null

    const result = formatHealthService(service, mockAdministration)
    expect(result).toBeNull()
  })

  it('should format service correctly with all fields', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      alsoKnownAs: 'Also Known As',
      commonlyTreatedCondition: 'Common Condition',
      typeOfCare: 'Primary care',
    })

    const result = formatHealthService(service, mockAdministration)
    expect(result).not.toBeNull()
    expect(result?.id).toBe('1')
    expect(result?.title).toBe('Test Service')
    expect(result?.alsoKnownAs).toBe('Also Known As')
    expect(result?.commonlyTreatedCondition).toBe('Common Condition')
    expect(result?.typeOfCare).toBe('Primary care')
  })

  it('should use Tricare description for Lovell Tricare administration', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      description: 'Regular description',
      tricareDescription: 'Tricare description',
    })

    const lovellTricareAdmin: Administration = {
      entityId: LOVELL.tricare.administration.entityId,
      name: 'Lovell Tricare',
    }

    const result = formatHealthService(service, lovellTricareAdmin)
    expect(result?.descriptionHtml).toBe('Tricare description')
  })

  it('should use regular description for non-Lovell Tricare administration', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      description: 'Regular description',
      tricareDescription: 'Tricare description',
    })

    const result = formatHealthService(service, mockAdministration)
    expect(result?.descriptionHtml).toBe('Regular description')
  })

  it('should handle missing optional fields', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      description: '',
      typeOfCare: '',
      alsoKnownAs: null,
      commonlyTreatedCondition: null,
      bodyContent: '',
    })
    // Set description to null
    if (service.field_service_name_and_descripti) {
      service.field_service_name_and_descripti.description = null
    }

    const result = formatHealthService(service, mockAdministration)
    expect(result?.alsoKnownAs).toBeNull()
    expect(result?.commonlyTreatedCondition).toBeNull()
    expect(result?.typeOfCare).toBe('')
  })

  it('should handle missing nid gracefully', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
    })
    service.drupal_internal__nid = undefined

    const result = formatHealthService(service, mockAdministration)
    expect(result?.id).toBe('')
  })

  it('should format locations correctly', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      locations: [
        {
          id: '1',
          title: 'Test Facility',
          path: '/test-facility',
          isMainLocation: true,
          facilityClassification: '',
          isMobile: false,
        },
      ],
    })
    // Set facility location (mock sets it to null by default)
    if (service.field_local_health_care_service_[0]) {
      service.field_local_health_care_service_[0].field_facility_location =
        createFacilityLocation({
          id: 'facility-1',
          title: 'Test Facility',
          path: { alias: '/test-facility', pid: 1, langcode: 'en' },
          field_main_location: true,
          field_facility_classification: '',
          field_mobile: false,
        })
    }

    const result = formatHealthService(service, mockAdministration)
    expect(result?.locations).toHaveLength(1)
    expect(result?.locations[0].title).toBe('Test Facility')
  })

  it('should handle null administration gracefully', () => {
    const service = createMockServiceDes({
      id: '1',
      title: 'Test Service',
      description: 'Service description',
    })

    const result = formatHealthService(
      service,
      null as unknown as Administration
    )
    expect(result).not.toBeNull()
    // Should use regular description when administration is null
    expect(result?.descriptionHtml).toBe('Service description')
  })
})

describe('groupHealthServicesByType', () => {
  const createMockHealthService = (
    overrides: Partial<HealthService> = {}
  ): HealthService => {
    return {
      id: '1',
      title: 'Test Service',
      alsoKnownAs: null,
      commonlyTreatedCondition: null,
      descriptionHtml: '',
      bodyHtml: '',
      typeOfCare: 'Primary care',
      locations: [],
      ...overrides,
    }
  }

  it('should group services by type of care', () => {
    const services: HealthService[] = [
      createMockHealthService({
        id: '1',
        title: 'Service A',
        typeOfCare: 'Primary care',
      }),
      createMockHealthService({
        id: '2',
        title: 'Service B',
        typeOfCare: 'Mental health care',
      }),
      createMockHealthService({
        id: '3',
        title: 'Service C',
        typeOfCare: 'Primary care',
      }),
    ]

    const result = groupHealthServicesByType(services)
    expect(result).toHaveLength(2)
    expect(result[0].typeOfCare).toBe('Primary care')
    expect(result[0].services).toHaveLength(2)
    expect(result[1].typeOfCare).toBe('Mental health care')
    expect(result[1].services).toHaveLength(1)
  })

  it('should sort services within each group alphabetically', () => {
    const services: HealthService[] = [
      createMockHealthService({
        id: '1',
        title: 'Zebra Service',
        typeOfCare: 'Primary care',
      }),
      createMockHealthService({
        id: '2',
        title: 'Alpha Service',
        typeOfCare: 'Primary care',
      }),
      createMockHealthService({
        id: '3',
        title: 'Beta Service',
        typeOfCare: 'Primary care',
      }),
    ]

    const result = groupHealthServicesByType(services)
    expect(result[0].services[0].title).toBe('Alpha Service')
    expect(result[0].services[1].title).toBe('Beta Service')
    expect(result[0].services[2].title).toBe('Zebra Service')
  })

  it('should sort groups by predefined order', () => {
    const services: HealthService[] = [
      createMockHealthService({
        id: '1',
        title: 'Other',
        typeOfCare: 'Other services',
      }),
      createMockHealthService({
        id: '2',
        title: 'Primary',
        typeOfCare: 'Primary care',
      }),
      createMockHealthService({
        id: '3',
        title: 'Specialty',
        typeOfCare: 'Specialty care',
      }),
      createMockHealthService({
        id: '4',
        title: 'Mental',
        typeOfCare: 'Mental health care',
      }),
      createMockHealthService({
        id: '5',
        title: 'Social',
        typeOfCare: 'Social programs and services',
      }),
    ]

    const result = groupHealthServicesByType(services)
    expect(result[0].typeOfCare).toBe('Primary care')
    expect(result[1].typeOfCare).toBe('Mental health care')
    expect(result[2].typeOfCare).toBe('Specialty care')
    expect(result[3].typeOfCare).toBe('Social programs and services')
    expect(result[4].typeOfCare).toBe('Other services')
  })

  it('should use "Other services" as default for services without typeOfCare', () => {
    const services: HealthService[] = [
      createMockHealthService({ id: '1', title: 'Service', typeOfCare: '' }),
      createMockHealthService({
        id: '2',
        title: 'Service 2',
        typeOfCare: null as unknown as string,
      }),
    ]

    const result = groupHealthServicesByType(services)
    expect(result).toHaveLength(1)
    expect(result[0].typeOfCare).toBe('Other services')
    expect(result[0].services).toHaveLength(2)
  })

  it('should filter out empty groups', () => {
    const services: HealthService[] = [
      createMockHealthService({
        id: '1',
        title: 'Service',
        typeOfCare: 'Primary care',
      }),
    ]

    const result = groupHealthServicesByType(services)
    // Should only have Primary care group, not all 5 predefined types
    expect(result).toHaveLength(1)
    expect(result[0].typeOfCare).toBe('Primary care')
  })

  it('should handle empty services array', () => {
    const result = groupHealthServicesByType([])
    expect(result).toHaveLength(0)
  })

  it('should handle services with unknown typeOfCare', () => {
    const services: HealthService[] = [
      createMockHealthService({
        id: '1',
        title: 'Service',
        typeOfCare: 'Unknown Type',
      }),
    ]

    const result = groupHealthServicesByType(services)
    // Unknown types are not in the predefined order, so they get filtered out
    // The function only returns groups that match the predefined typeOrder
    expect(result).toHaveLength(0)
  })

  it('should handle mixed known and unknown typeOfCare', () => {
    const services: HealthService[] = [
      createMockHealthService({
        id: '1',
        title: 'Service',
        typeOfCare: 'Unknown Type',
      }),
      createMockHealthService({
        id: '2',
        title: 'Primary',
        typeOfCare: 'Primary care',
      }),
    ]

    const result = groupHealthServicesByType(services)
    // Only the known type should appear
    expect(result).toHaveLength(1)
    expect(result[0].typeOfCare).toBe('Primary care')
    expect(result[0].services).toHaveLength(1)
  })
})

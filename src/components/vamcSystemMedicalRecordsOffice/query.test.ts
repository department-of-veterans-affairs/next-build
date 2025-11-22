/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import {
  NodeVamcSystemMedicalRecordsOffice,
  NodeVhaFacilityNonclinicalService,
} from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'
import { LovellStaticPropsContextProps } from '@/lib/drupal/lovell/types'
import {
  createMedicalRecordsServiceQueryMocks,
  mockMedicalRecordsServices,
} from '@/components/vhaFacilityNonclinicalService/query.test-utils'

const mockPageQuery = jest.fn(
  () => mockPage as NodeVamcSystemMedicalRecordsOffice
)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

const serviceMocks = createMedicalRecordsServiceQueryMocks()

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.VAMC_SYSTEM_MEDICAL_RECORDS_OFFICE,
  mockPageQuery
)
mockDrupalQuery.fetchAndConcatAllResourceCollectionPages.mockImplementation(
  serviceMocks.mockFetchAndConcatAllResourceCollectionPages
)
mockDrupalQuery.getMenu.mockReturnValue(mockMenu)

jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    translatePath: jest.fn().mockResolvedValue({
      entity: {
        path: '/test-translated-path',
      },
    }),
  },
}))

function runQuery(lovell: Partial<LovellStaticPropsContextProps> = {}) {
  return queries.getData(RESOURCE_TYPES.VAMC_SYSTEM_MEDICAL_RECORDS_OFFICE, {
    id: mockPage.id,
    context: {
      path: '/test-path',
      drupalPath: '/test-drupal-path',
      listing: {
        isListingPage: false,
        firstPagePath: '/test-first-page-path',
        page: 1,
      },
      lovell: {
        isLovellVariantPage: false,
        variant: null,
        ...lovell,
      },
    },
  })
}

describe('VamcSystemMedicalRecordsOffice formatter', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockPageQuery.mockReturnValue(
      mockPage as NodeVamcSystemMedicalRecordsOffice
    )
    serviceMocks.reset()
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  test('formats services array correctly and sorts them alphabetically', async () => {
    const result = await runQuery()

    expect(result.services).toBeDefined()
    expect(result.services).toHaveLength(1)

    const service = result.services[0]
    expect(service.id).toBe('209b73cd-22e9-4cd4-901f-99e1b3c9fff0')
    expect(service.title).toBe('Toledo VA Clinic')
    expect(service.path).toBe(
      '/ann-arbor-health-care/locations/toledo-va-clinic'
    )
    expect(service.address).toEqual({
      langcode: null,
      country_code: 'US',
      administrative_area: 'OH',
      locality: 'Toledo',
      dependent_locality: null,
      postal_code: '43614-5903',
      address_line1: '1200 South Detroit Avenue',
      additional_name: null,
    })
    expect(service.phoneNumber).toBe('419-259-2000')
    expect(service.serviceLocations).toHaveLength(1)
    expect(service.serviceLocations[0]).toBeDefined()
  })

  test('sorts services alphabetically by title', async () => {
    const unsortedServices = [
      {
        ...mockMedicalRecordsServices[0],
        field_facility_location: {
          ...mockMedicalRecordsServices[0].field_facility_location,
          title: 'Zebra Medical Center',
        },
      },
      {
        ...mockMedicalRecordsServices[0],
        field_facility_location: {
          ...mockMedicalRecordsServices[0].field_facility_location,
          title: 'Alpha Medical Center',
        },
      },
    ]

    serviceMocks.mockServicesQuery.mockResolvedValue(
      unsortedServices as NodeVhaFacilityNonclinicalService[]
    )

    const result = await runQuery()

    expect(result.services).toHaveLength(2)
    expect(result.services[0].title).toBe('Alpha Medical Center')
    expect(result.services[1].title).toBe('Zebra Medical Center')
  })

  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/medical-records-office',
      pid: 79642,
      langcode: 'en',
    }
    const lovellBreadcrumbs = [
      {
        uri: 'https://va-gov-cms.ddev.site/',
        title: 'Home',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care',
        title: 'Lovell Federal health care',
        options: [],
      },
      {
        uri: 'internal:#',
        title: 'Medical records office',
        options: [],
      },
    ]

    test('outputs formatted data with Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
      } as NodeVamcSystemMedicalRecordsOffice)

      const result = await runQuery({
        isLovellVariantPage: true,
        variant: 'tricare',
      })

      expect(result.lovellVariant).toBe('tricare')
      expect(result.lovellSwitchPath).toBe(
        '/lovell-federal-health-care-va/medical-records-office'
      )
    })

    test('updates the breadcrumbs for Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemMedicalRecordsOffice)

      const result = await runQuery({
        isLovellVariantPage: true,
        variant: 'tricare',
      })

      expect(result.breadcrumbs[1]).toEqual({
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care-tricare',
        title: 'Lovell Federal health care - TRICARE',
        options: [],
      })
    })

    test('does not modify breadcrumbs when not a Lovell variant page', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemMedicalRecordsOffice)

      const result = await runQuery({
        isLovellVariantPage: false,
        variant: 'va',
      })

      expect(result.breadcrumbs).toEqual(lovellBreadcrumbs)
    })
  })
})

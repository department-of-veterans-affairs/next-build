/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import mockServices from './mock.services.json'
import {
  NodeVamcSystemBillingAndInsurance,
  NodeVhaFacilityNonclinicalService,
} from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'
import { LovellStaticPropsContextProps } from '@/lib/drupal/lovell/types'

const mockPageQuery = jest.fn(
  () => mockPage as NodeVamcSystemBillingAndInsurance
)
const mockServicesQuery = jest.fn(
  () => mockServices as NodeVhaFacilityNonclinicalService[]
)

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockPageQuery(),
  fetchAndConcatAllResourceCollectionPages: () => ({
    data: mockServicesQuery(),
  }),
  getMenu: () => mockMenu,
}))

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
  return queries.getData(RESOURCE_TYPES.VAMC_SYSTEM_BILLING_INSURANCE, {
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

describe('VamcSystemBillingAndInsurance formatter', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockPageQuery.mockReturnValue(mockPage as NodeVamcSystemBillingAndInsurance)
    mockServicesQuery.mockReturnValue(
      mockServices as NodeVhaFacilityNonclinicalService[]
    )
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  test('sorts services alphabetically by title', async () => {
    const unsortedServices = [
      {
        ...mockServices[0],
        field_facility_location: {
          ...mockServices[0].field_facility_location,
          title: 'Zebra Medical Center',
        },
      },
      {
        ...mockServices[0],
        field_facility_location: {
          ...mockServices[0].field_facility_location,
          title: 'Alpha Medical Center',
        },
      },
    ]

    mockServicesQuery.mockReturnValue(
      unsortedServices as NodeVhaFacilityNonclinicalService[]
    )

    const result = await runQuery()

    expect(result.services).toHaveLength(2)
    expect(result.services[0].title).toBe('Alpha Medical Center')
    expect(result.services[1].title).toBe('Zebra Medical Center')
  })

  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/billing-and-insurance',
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
        title: 'Billing and insurance',
        options: [],
      },
    ]

    test('outputs formatted data with Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
      } as NodeVamcSystemBillingAndInsurance)

      const result = await runQuery({
        isLovellVariantPage: true,
        variant: 'tricare',
      })

      expect(result.lovellVariant).toBe('tricare')
      expect(result.lovellSwitchPath).toBe(
        '/lovell-federal-health-care-va/billing-and-insurance'
      )
    })

    test('updates the breadcrumbs for Lovell variant', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemBillingAndInsurance)

      const result = await runQuery({
        isLovellVariantPage: true,
        variant: 'tricare',
      })

      expect(result.breadcrumbs[1]).toEqual({
        href: '/lovell-federal-health-care-tricare',
        label: 'Lovell Federal health care - TRICARE',
        options: [],
      })
    })

    test('does not modify breadcrumbs when not a Lovell variant page', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        path: lovellPath,
        breadcrumbs: lovellBreadcrumbs,
      } as NodeVamcSystemBillingAndInsurance)

      const result = await runQuery({
        isLovellVariantPage: false,
        variant: 'va',
      })

      expect(result.breadcrumbs).toEqual([
        {
          href: '/',
          label: 'Home',
          options: [],
        },
        {
          href: '/lovell-federal-health-care',
          label: 'Lovell Federal health care',
          options: [],
        },
        {
          href: '',
          label: 'Billing and insurance',
          options: [],
        },
      ])
    })
  })
})

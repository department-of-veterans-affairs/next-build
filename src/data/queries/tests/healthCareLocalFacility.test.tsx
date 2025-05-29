/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import { DrupalMenuLinkContent } from 'next-drupal'
import {
  formatter,
  LocalFacilityData,
  params,
} from '../healthCareLocalFacility'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { deflateObjectGraph } from '@/lib/utils/object-graph'

const menuItem: DrupalMenuLinkContent = {
  title: 'Foo',
  type: 'meh',
  url: '/nowhere/in-particular',
  id: 'foo',
  description: 'bar',
  enabled: true,
  expanded: true,
  menu_name: 'baz',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

const mockMenu = {
  items: [menuItem],
  tree: [menuItem],
}

const TRICARE_TEST_ID = 'lovel tricare test'

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: (opts: { id: string }) => {
    if (opts.id === TRICARE_TEST_ID) {
      return {
        ...mockFacilityData,
        path: {
          alias:
            '/lovell-federal-health-care-tricare/locations/causeway-va-clinic',
        },
      }
    }
    return mockFacilityData
  },
  getMenu: jest.fn(() => mockMenu),
}))

describe('DrupalJsonApiParams configuration', () => {
  it('should use the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_region_page/)
  })
})

describe('HealthCareLocalFacility query', () => {
  it('should output formatted data', async () => {
    const data = await queries.getData(RESOURCE_TYPES.VAMC_FACILITY, {
      id: mockFacilityData.id,
    })
    expect(deflateObjectGraph(data)).toMatchSnapshot()
  })

  it('should handle the Lovell variant page menu', async () => {
    const data = await queries.getData(RESOURCE_TYPES.VAMC_FACILITY, {
      id: TRICARE_TEST_ID,
      context: {
        path: '',
        drupalPath: '',
        listing: { isListingPage: false, firstPagePath: '', page: 0 },
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare',
        },
      },
    })
    expect(deflateObjectGraph(data)).toMatchSnapshot()
  })
})

describe('formatter', () => {
  const formatterParams: LocalFacilityData = {
    menu: mockMenu,
    entity: mockFacilityData,
    lovell: {
      isLovellVariantPage: false,
      variant: 'va',
    },
  }

  describe('relatedLinks', () => {
    it('should return the correct related links', () => {
      expect(formatter(formatterParams).relatedLinks).toEqual({
        links: [
          {
            title: 'Get help from a patient advocate',
            uri: '/boston-health-care/health-services/patient-advocates',
          },
          {
            title: 'Find a phone number',
            uri: '/boston-health-care/contact-us',
          },
          {
            title: 'Interactive facility maps',
            uri: 'https://www.va.gov/boston-health-care/programs/interactive-facility-maps',
          },
          {
            title: 'Check your billing, insurance and payment options',
            uri: '/boston-health-care/billing-and-insurance',
          },
          {
            title: 'Access your health records',
            uri: '/boston-health-care/medical-records-office',
          },
          {
            title: 'Compare our performance with non-VA facilities',
            uri: '/boston-health-care/about-us/performance',
          },
          {
            title: 'Learn about virtual care and service options',
            uri: 'https://www.va.gov/boston-health-care/programs/connected-care/',
          },
          {
            title: 'Volunteer or donate',
            uri: '/boston-health-care/work-with-us/volunteer-or-donate',
          },
        ],
        sectionTitle: 'Other services at VA Boston health care',
      })
    })

    // Redundant, yes, but explicit
    it('should limit the links to 8', () => {
      expect(formatter(formatterParams).relatedLinks.links).toHaveLength(8)
    })

    // Also redundant, but explicit
    it('should return the correct section title when field_region_page.title exists', () => {
      expect(formatter(formatterParams).relatedLinks.sectionTitle).toEqual(
        'Other services at VA Boston health care'
      )
    })

    it('should return the correct section title when field_region_page.title does not exist', () => {
      expect(
        formatter({
          ...formatterParams,
          entity: {
            ...mockFacilityData,
            field_region_page: {
              ...mockFacilityData.field_region_page,
              title: null,
            },
          },
        }).relatedLinks.sectionTitle
      ).toEqual('In the spotlight at VA Boston health care')
    })
    it('should set the lovellSwitchPath if this is the main Lovell facility', () => {
      expect(
        formatter({
          ...formatterParams,
          entity: {
            ...mockFacilityData,
            field_main_location: true,
            path: {
              alias:
                '/lovell-federal-health-care-va/locations/captain-james-a-lovell-federal-health-care-center',
              pid: 1999,
              langcode: 'en',
            },
          },
          lovell: {
            isLovellVariantPage: true,
            variant: 'va',
          },
        }).lovellSwitchPath
      ).toEqual(
        '/lovell-federal-health-care-tricare/locations/captain-james-a-lovell-federal-health-care-center'
      )
    })
    it('should not set the lovellSwitchPath if this is the not the main Lovell facility', () => {
      expect(
        formatter({
          ...formatterParams,
          entity: {
            ...mockFacilityData,
            field_main_location: false,
            path: {
              alias:
                '/lovell-federal-health-care-va/locations/evanston-va-clinic',
              pid: 1999,
              langcode: 'en',
            },
          },
          lovell: {
            isLovellVariantPage: true,
            variant: 'va',
          },
        }).lovellSwitchPath
      ).toBeNull()
    })
  })
})

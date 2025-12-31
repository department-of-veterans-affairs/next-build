/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from './mock'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { formatter, VamcSystemPoliciesPageData } from './query'
import { DrupalMenuLinkContent } from 'next-drupal'

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

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

jest.mock('@/components/vamcSystem/vamcSystemAndMenu')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE,
  () => mockData
)

describe('VamcSystemPoliciesPage data fetching', () => {
  test('fetches and formats data correctly', async () => {
    const result = await queries.getData(
      RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE,
      { id: mockData.id }
    )

    expect(result).toMatchSnapshot()
    expect(result).toHaveProperty('menu')
    expect(result).toHaveProperty('title', 'Policies')
    expect(result).toHaveProperty('introText')
    expect(result).toHaveProperty('topOfPageContent')
    expect(result).toHaveProperty('visitationPolicy')
    expect(result).toHaveProperty('otherPolicies')
    expect(result).toHaveProperty('generalVisitationPolicy')
    expect(result).toHaveProperty('bottomOfPageContent')
  })
})

describe('VamcSystemPoliciesPage formatter', () => {
  test('formats data with menu correctly', () => {
    const mockDataStructure: VamcSystemPoliciesPageData = {
      entity: mockData,
      vamcSystem: null,
      menu: mockMenu,
      lovell: undefined,
    }

    const result = formatter(mockDataStructure)

    expect(result).toHaveProperty('menu')
    expect(result.menu).toHaveProperty('rootPath')
    expect(result.menu).toHaveProperty('data')
    expect(result).toHaveProperty('title', 'Policies')
  })

  test('formats data without Lovell context', () => {
    const mockDataStructure: VamcSystemPoliciesPageData = {
      entity: mockData,
      vamcSystem: null,
      menu: mockMenu,
      lovell: undefined,
    }

    const result = formatter(mockDataStructure)

    expect(result.lovellVariant).toBeUndefined()
    expect(result.lovellSwitchPath).toBeNull()
  })

  test('should set the lovellSwitchPath correctly for Lovell VA variant', () => {
    const result = formatter({
      entity: {
        ...mockData,
        // Override the path to simulate a Lovell VA path
        path: {
          ...mockData.path,
          alias: '/lovell-federal-health-care-va/policies',
        },
      },
      vamcSystem: null,
      menu: mockMenu,
      lovell: {
        variant: 'va',
        isLovellVariantPage: true,
      },
    })

    expect(result.lovellSwitchPath).toBe(
      '/lovell-federal-health-care-tricare/policies'
    )
  })

  // NOTE: There is no TRICARE variant of this content type
})

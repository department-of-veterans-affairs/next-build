/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from './mock'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { formatter, params, VamcSystemPoliciesPageData } from './query'
import { Menu } from '@/types/drupal/menu'

// Mock the drupal query functions
jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData,
  getMenu: jest.fn(
    (): Menu => ({
      items: [],
      tree: [],
    })
  ),
}))

describe('VamcSystemPoliciesPage params configuration', () => {
  test('params function sets the correct include fields', () => {
    const queryParams = params()
    const includes = queryParams.getQueryObject().include?.split(',')

    expect(includes).toContain('field_office')
  })
})

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
    const mockMenu: Menu = {
      items: [],
      tree: [],
    }

    const mockDataStructure: VamcSystemPoliciesPageData = {
      entity: mockData,
      menu: mockMenu,
      lovell: undefined,
    }

    const result = formatter(mockDataStructure)

    expect(result).toHaveProperty('menu')
    expect(result.menu).toHaveProperty('rootPath')
    expect(result.menu).toHaveProperty('data')
    expect(result).toHaveProperty('title', 'Policies')
  })
})

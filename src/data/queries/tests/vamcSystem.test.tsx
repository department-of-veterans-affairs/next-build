/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystem.mock.json'
import mockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import mockStoryData from '@/mocks/newsStory.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../vamcSystem'

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData,
  fetchAndConcatAllResourceCollectionPages: (nodeType: string) => {
    switch (nodeType) {
      case RESOURCE_TYPES.VAMC_FACILITY:
        return { data: [mockFacilityData] }
      case RESOURCE_TYPES.STORY:
        return { data: [mockStoryData] }
      default:
        return { data: [] }
    }
  },
  getMenu: () => ({
    items: [],
    tree: [],
  }),
}))

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatchSnapshot()
  })
})

describe('VamcSystem formatData', () => {
  test('outputs formatted data', async () => {
    expect(
      await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, { id: mockData.id })
    ).toMatchSnapshot()
  })
})

/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystem.mock.json'
import mockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import mockStoryData from '@/products/newsStory/mock.json'
import mockEventData from '@/products/event/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../vamcSystem'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const mockFeaturedEventData = {
  ...mockEventData,
  // Just to differentiate in the snapshot
  field_featured: true,
  title: 'Dodgeball Club',
}

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData,
  fetchAndConcatAllResourceCollectionPages: (
    nodeType: string,
    params: DrupalJsonApiParams
  ) => {
    switch (nodeType) {
      case RESOURCE_TYPES.VAMC_FACILITY:
        return { data: [mockFacilityData] }
      case RESOURCE_TYPES.STORY:
        return { data: [mockStoryData] }
      case RESOURCE_TYPES.EVENT:
        if (params.getQueryObject().filter.field_featured === '1') {
          return { data: [mockFeaturedEventData] }
        }
        return { data: [mockEventData] }
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
  beforeAll(() => {
    // Mock Date.now() to return a fixed timestamp so that mock events
    // aren't filtered out by getNextEventOccurrences
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-01-01').getTime())
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('outputs formatted data', async () => {
    expect(
      await queries.getData(RESOURCE_TYPES.VAMC_SYSTEM, { id: mockData.id })
    ).toMatchSnapshot()
  })
})

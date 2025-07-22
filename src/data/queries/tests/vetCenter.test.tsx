/**
 * @jest-environment node
 */

import { mockResponse as mockVetCenter } from '@/mocks/vetCenter.mock'
import mockBannerMedia from '@/mocks/mediaImage.mock.json'
import { queries } from '@/data/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const mockBannerMediaQuery = jest.fn()
const mockVetCenterQuery = jest.fn()

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: (...args) => mockVetCenterQuery(...args),
  fetchAndConcatAllResourceCollectionPages: (nodeType: string) => {
    if (nodeType === 'media--image') {
      return mockBannerMediaQuery()
    }
    return { data: [] }
  },
}))

function getData() {
  return queries.getData(RESOURCE_TYPES.VET_CENTER, {
    id: mockVetCenter.id,
  })
}

describe('VetCenter query', () => {
  beforeEach(() => {
    // Reset mocks to default behavior before each test
    mockVetCenterQuery.mockReturnValue(mockVetCenter)
    mockBannerMediaQuery.mockReturnValue({
      data: [mockBannerMedia],
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('fetches and returns formatted VetCenter data with banner image', async () => {
    const result = await getData()

    expect(result).toBeDefined()
    expect(result.title).toBe(mockVetCenter.title)
    expect(result.bannerImage).toBeDefined()
    expect(result.bannerImage).toHaveProperty('id')
    expect(result.bannerImage).toHaveProperty('links')
    expect(mockBannerMediaQuery).toHaveBeenCalled()
  })

  describe('Banner Image functionality', () => {
    test('handles missing banner media gracefully', async () => {
      // Mock banner media fetch to return empty array
      mockBannerMediaQuery.mockReturnValue({
        data: [],
      })

      const result = await getData()

      expect(result.bannerImage).toBeNull()
    })

    test('banner image contains expected MediaImage properties', async () => {
      const result = await getData()

      expect(result.bannerImage).not.toBeNull()
      expect(typeof result.bannerImage.id).toBe('string')
      expect(result.bannerImage.alt).toBeDefined()
      expect(result.bannerImage.title).toBeDefined()
      expect(typeof result.bannerImage.width).toBe('number')
      expect(typeof result.bannerImage.height).toBe('number')
      expect(result.bannerImage.links).toBeDefined()
      expect(typeof result.bannerImage.links).toBe('object')
    })

    test('banner image links contain href properties', async () => {
      const result = await getData()

      expect(result.bannerImage).not.toBeNull()
      const links = result.bannerImage?.links
      expect(links).toBeDefined()
      const linkKeys = Object.keys(result.bannerImage.links)
      expect(linkKeys.length).toBeGreaterThan(0)

      // Check that each link has an href property
      linkKeys.forEach((key) => {
        const link = result.bannerImage.links[key]
        expect(link).toHaveProperty('href')
        expect(typeof link.href).toBe('string')
        expect(link.href).toBeTruthy()
      })
    })
  })

  describe('Mission Explainer functionality', () => {
    test('formats mission explainer correctly when data is present', async () => {
      const result = await getData()

      expect(result.missionExplainer).toBeDefined()
      expect(result.missionExplainer.heading).toBe('Our commitment')
      expect(result.missionExplainer.body).toContain(
        'We offer a range of services'
      )
      expect(result.missionExplainer.body).toContain(
        'talk therapy to recreational activities'
      )
    })

    test('returns null for mission explainer when heading is missing', async () => {
      // Create custom mock for this test
      const mockVetCenterWithMissingHeading = {
        ...mockVetCenter,
        field_mission_explainer: {
          target_id: '158439',
          fetched_bundle: 'magichead_group',
          fetched: {
            field_magichead_body: [
              {
                value: '<p>Some body content</p>',
                format: 'rich_text_limited',
                processed: '<p>Some body content</p>',
              },
            ],
            field_magichead_heading: [], // Empty heading array
          },
        },
      }

      mockVetCenterQuery.mockReturnValue(mockVetCenterWithMissingHeading)

      const result = await getData()

      expect(result.missionExplainer).toBeNull()
    })

    test('returns null for mission explainer when body is missing', async () => {
      // Create custom mock for this test
      const mockVetCenterWithMissingBody = {
        ...mockVetCenter,
        field_mission_explainer: {
          target_id: '158439',
          fetched_bundle: 'magichead_group',
          fetched: {
            field_magichead_body: [], // Empty body array
            field_magichead_heading: [{ value: 'Our commitment' }],
          },
        },
      }

      mockVetCenterQuery.mockReturnValue(mockVetCenterWithMissingBody)

      const result = await getData()

      expect(result.missionExplainer).toBeNull()
    })

    test('returns null for mission explainer when both heading and body are missing', async () => {
      // Create custom mock for this test
      const mockVetCenterWithMissingBoth = {
        ...mockVetCenter,
        field_mission_explainer: {
          target_id: '158439',
          fetched_bundle: 'magichead_group',
          fetched: {
            field_magichead_body: [],
            field_magichead_heading: [],
          },
        },
      }

      mockVetCenterQuery.mockReturnValue(mockVetCenterWithMissingBoth)

      const result = await getData()

      expect(result.missionExplainer).toBeNull()
    })

    test('handles undefined mission explainer field gracefully', async () => {
      // Create custom mock for this test
      const mockVetCenterWithUndefinedFields = {
        ...mockVetCenter,
        field_mission_explainer: {
          target_id: '158439',
          fetched_bundle: 'magichead_group',
          fetched: {
            field_magichead_body: [null], // Array with null value
            field_magichead_heading: [undefined], // Array with undefined value
          },
        },
      }

      mockVetCenterQuery.mockReturnValue(mockVetCenterWithUndefinedFields)

      const result = await getData()

      expect(result.missionExplainer).toBeNull()
    })

    test('returns null for mission explainer when field_mission_explainer is null', async () => {
      const mockWithNullField = {
        ...mockVetCenter,
        field_mission_explainer: null,
      }

      mockVetCenterQuery.mockReturnValue(mockWithNullField)

      const result = await getData()

      expect(result.missionExplainer).toBeNull()
    })
  })

  test('correctly filters health services by care type', async () => {
    const result = await getData()

    expect(result.counselingHealthServices).toBeDefined()
    expect(result.referralHealthServices).toBeDefined()
    expect(result.otherHealthServices).toBeDefined()
  })

  test('handles empty health services array', async () => {
    // Create mock with empty health services
    const mockVetCenterWithEmptyHealthServices = {
      ...mockVetCenter,
      field_health_services: [],
    }

    mockVetCenterQuery.mockReturnValue(mockVetCenterWithEmptyHealthServices)

    const result = await getData()

    expect(result.healthServices).toEqual([])
    expect(result.counselingHealthServices).toEqual([])
    expect(result.referralHealthServices).toEqual([])
    expect(result.otherHealthServices).toEqual([])
  })

  test('builds featured content array including centralized content', async () => {
    const result = await getData()

    expect(result.featuredContent).toBeDefined()
  })

  test('builds FAQs section correctly', async () => {
    const result = await getData()

    expect(result.ccVetCenterFaqs).toBeDefined()
    expect(result.ccVetCenterFaqs.questions.length).toBeGreaterThan(0)
  })
})

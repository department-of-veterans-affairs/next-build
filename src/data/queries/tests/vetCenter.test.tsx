/**
 * @jest-environment node
 */

import { formatter, VetCenterData } from '../vetCenter' // Adjust the import path as necessary
import { mockResponse as mockVetCenter } from '@/mocks/vetCenter.mock'
import { DrupalMediaImage } from '@/types/drupal/media'
import mockBannerMediaJson from '@/mocks/mediaImage.mock.json'
import { queries } from '@/data/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// Use the existing media image mock as banner media with proper type casting
const bannerMedia = mockBannerMediaJson as unknown as DrupalMediaImage

// Create the VetCenterData mock
const mockVetCenterData: VetCenterData = {
  entity: mockVetCenter,
  bannerMedia: bannerMedia,
}

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

describe('VetCenter data function', () => {
  beforeEach(() => {
    // Reset mocks to default behavior before each test
    mockVetCenterQuery.mockReturnValue(mockVetCenter)
    mockBannerMediaQuery.mockReturnValue({
      data: [bannerMedia],
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('fetches and returns formatted VetCenter data with banner image', async () => {
    const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
      id: mockVetCenter.id,
    })

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

      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

      expect(result.bannerImage).toBeNull()
    })

    test('banner image contains expected MediaImage properties', async () => {
      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

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
      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

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
      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

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

      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

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

      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

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

      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

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

      const result = await queries.getData(RESOURCE_TYPES.VET_CENTER, {
        id: mockVetCenter.id,
      })

      expect(result.missionExplainer).toBeNull()
    })

    test('returns null for mission explainer when field_mission_explainer is null', () => {
      const mockWithNullField = {
        ...VetCenterMock,
        field_mission_explainer: null,
      }

      const formattedVetCenter = formatter(mockWithNullField)
      expect(formattedVetCenter.missionExplainer).toBeNull()
    })
  })
})

describe('VetCenter formatter function', () => {
  // Example test for filtering health services
  test('correctly filters health services by care type', () => {
    const formattedVetCenter = formatter(mockVetCenterData)

    expect(formattedVetCenter.counselingHealthServices).toBeDefined()
    expect(formattedVetCenter.referralHealthServices).toBeDefined()
    expect(formattedVetCenter.otherHealthServices).toBeDefined()
  })

  test('handles empty health services array', () => {
    const modifiedmockVetCenter: VetCenterData = {
      entity: {
        ...mockVetCenter,
        field_health_services: [],
      },
      bannerMedia: bannerMedia,
    }
    const formattedVetCenter = formatter(modifiedmockVetCenter)

    expect(formattedVetCenter.healthServices).toEqual([])
    expect(formattedVetCenter.counselingHealthServices).toEqual([])
    expect(formattedVetCenter.referralHealthServices).toEqual([])
    expect(formattedVetCenter.otherHealthServices).toEqual([])
  })

  test('builds featured content array including centralized content', () => {
    const formattedVetCenter = formatter(mockVetCenterData)
    expect(formattedVetCenter.featuredContent).toBeDefined()
  })

  test('builds FAQs section correctly', () => {
    const formattedVetCenter = formatter(mockVetCenterData)

    expect(formattedVetCenter.ccVetCenterFaqs).toBeDefined()
    expect(formattedVetCenter.ccVetCenterFaqs.questions.length).toBeGreaterThan(
      0
    )
  })
})

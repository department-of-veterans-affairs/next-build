/**
 * @jest-environment node
 */

import { NodeVetCenter } from '@/types/drupal/node'
import { formatter, VetCenterData } from '../vetCenter' // Adjust the import path as necessary
import { mockResponse } from '@/mocks/vetCenter.mock'
import { DrupalMediaImage } from '@/types/drupal/media'
import mockBannerMediaJson from '@/mocks/mediaImage.mock.json'

const VetCenterMock: NodeVetCenter = mockResponse

// Use the existing media image mock as banner media with proper type casting
const bannerMedia = mockBannerMediaJson as unknown as DrupalMediaImage

// Create the VetCenterData mock
const VetCenterDataMock: VetCenterData = {
  entity: VetCenterMock,
  bannerMedia: bannerMedia,
}

describe('VetCenter formatter function', () => {
  // Example test for filtering health services
  test('correctly filters health services by care type', () => {
    const formattedVetCenter = formatter(VetCenterDataMock)

    expect(formattedVetCenter.counselingHealthServices).toBeDefined()
    expect(formattedVetCenter.referralHealthServices).toBeDefined()
    expect(formattedVetCenter.otherHealthServices).toBeDefined()
  })

  test('handles empty health services array', () => {
    const modifiedVetCenterMock: VetCenterData = {
      entity: {
        ...VetCenterMock,
        field_health_services: [],
      },
      bannerMedia: bannerMedia,
    }
    const formattedVetCenter = formatter(modifiedVetCenterMock)

    expect(formattedVetCenter.healthServices).toEqual([])
    expect(formattedVetCenter.counselingHealthServices).toEqual([])
    expect(formattedVetCenter.referralHealthServices).toEqual([])
    expect(formattedVetCenter.otherHealthServices).toEqual([])
  })

  test('builds featured content array including centralized content', () => {
    const formattedVetCenter = formatter(VetCenterDataMock)
    expect(formattedVetCenter.featuredContent).toBeDefined()
  })

  test('builds FAQs section correctly', () => {
    const formattedVetCenter = formatter(VetCenterDataMock)

    expect(formattedVetCenter.ccVetCenterFaqs).toBeDefined()
    expect(formattedVetCenter.ccVetCenterFaqs.questions.length).toBeGreaterThan(
      0
    )
  })

  describe('Banner Image functionality', () => {
    test('handles missing banner media gracefully', () => {
      const mockWithoutBannerMedia: VetCenterData = {
        entity: VetCenterMock,
        bannerMedia: null,
      }

      const formattedVetCenter = formatter(mockWithoutBannerMedia)
      expect(formattedVetCenter.bannerImage).toBeNull()
    })

    test('banner image contains expected MediaImage properties', () => {
      const formattedVetCenter = formatter(VetCenterDataMock)

      expect(formattedVetCenter.bannerImage).not.toBeNull()
      expect(typeof formattedVetCenter.bannerImage.id).toBe('string')
      expect(formattedVetCenter.bannerImage.alt).toBeDefined()
      expect(formattedVetCenter.bannerImage.title).toBeDefined()
      expect(typeof formattedVetCenter.bannerImage.width).toBe('number')
      expect(typeof formattedVetCenter.bannerImage.height).toBe('number')
      expect(formattedVetCenter.bannerImage.links).toBeDefined()
      expect(typeof formattedVetCenter.bannerImage.links).toBe('object')
    })

    test('banner image links contain href properties', () => {
      const formattedVetCenter = formatter(VetCenterDataMock)

      expect(formattedVetCenter.bannerImage).not.toBeNull()
      const links = formattedVetCenter.bannerImage?.links
      expect(links).toBeDefined()
      const linkKeys = Object.keys(formattedVetCenter.bannerImage.links)
      expect(linkKeys.length).toBeGreaterThan(0)

      // Check that each link has an href property
      linkKeys.forEach((key) => {
        const link = formattedVetCenter.bannerImage.links[key]
        expect(link).toHaveProperty('href')
        expect(typeof link.href).toBe('string')
        expect(link.href).toBeTruthy()
      })
    })
  })

  describe('Mission Explainer functionality', () => {
    // Helper function to create mission explainer mock data
    const createMissionExplainerMock = (
      headingArray: Array<{ value: string } | undefined> = [],
      bodyArray: Array<{
        value: string
        format: string
        processed: string
      } | null> = []
    ): VetCenterData => ({
      entity: {
        ...VetCenterMock,
        field_mission_explainer: {
          target_id: '158439',
          fetched_bundle: 'magichead_group',
          fetched: {
            field_magichead_body: bodyArray,
            field_magichead_heading: headingArray,
          },
        },
      },
      bannerMedia: bannerMedia,
    })

    test('formats mission explainer correctly when data is present', () => {
      const formattedVetCenter = formatter(VetCenterDataMock)

      expect(formattedVetCenter.missionExplainer).toBeDefined()
      expect(formattedVetCenter.missionExplainer.heading).toBe('Our commitment')
      expect(formattedVetCenter.missionExplainer.body).toContain(
        'We offer a range of services'
      )
      expect(formattedVetCenter.missionExplainer.body).toContain(
        'talk therapy to recreational activities'
      )
    })

    test('returns null for mission explainer when heading is missing', () => {
      const mockWithMissingHeading = createMissionExplainerMock(
        [], // Empty heading array
        [
          {
            value: '<p>Some body content</p>',
            format: 'rich_text_limited',
            processed: '<p>Some body content</p>',
          },
        ]
      )

      const formattedVetCenter = formatter(mockWithMissingHeading)
      expect(formattedVetCenter.missionExplainer).toBeNull()
    })

    test('returns null for mission explainer when body is missing', () => {
      const mockWithMissingBody = createMissionExplainerMock(
        [{ value: 'Our commitment' }],
        [] // Empty body array
      )

      const formattedVetCenter = formatter(mockWithMissingBody)
      expect(formattedVetCenter.missionExplainer).toBeNull()
    })

    test('returns null for mission explainer when both heading and body are missing', () => {
      const mockWithMissingBoth = createMissionExplainerMock([], [])

      const formattedVetCenter = formatter(mockWithMissingBoth)
      expect(formattedVetCenter.missionExplainer).toBeNull()
    })

    test('handles undefined mission explainer field gracefully', () => {
      const mockWithUndefinedFields = createMissionExplainerMock(
        [undefined], // Array with undefined value
        [null] // Array with null value
      )

      // Should not throw an error and should return null
      const formattedVetCenter = formatter(mockWithUndefinedFields)
      expect(formattedVetCenter.missionExplainer).toBeNull()
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

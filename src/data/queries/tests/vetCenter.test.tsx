/**
 * @jest-environment node
 */

import { NodeVetCenter } from '@/types/drupal/node'
import { formatter } from '../vetCenter' // Adjust the import path as necessary
import { mockResponse } from '@/mocks/vetCenter.mock'

const VetCenterMock: NodeVetCenter = mockResponse

describe('VetCenter formatter function', () => {
  // Example test for filtering health services
  test('correctly filters health services by care type', () => {
    const formattedVetCenter = formatter(VetCenterMock)

    expect(formattedVetCenter.counselingHealthServices).toBeDefined()
    expect(formattedVetCenter.referralHealthServices).toBeDefined()
    expect(formattedVetCenter.otherHealthServices).toBeDefined()
  })

  test('handles empty health services array', () => {
    const modifiedVetCenterMock = {
      ...VetCenterMock,
      field_health_services: [],
    }
    const formattedVetCenter = formatter(modifiedVetCenterMock)

    expect(formattedVetCenter.healthServices).toEqual([])
    expect(formattedVetCenter.counselingHealthServices).toEqual([])
    expect(formattedVetCenter.referralHealthServices).toEqual([])
    expect(formattedVetCenter.otherHealthServices).toEqual([])
  })

  test('builds featured content array including centralized content', () => {
    const formattedVetCenter = formatter(VetCenterMock)
    expect(formattedVetCenter.featuredContent).toBeDefined()
  })

  test('builds FAQs section correctly', () => {
    const formattedVetCenter = formatter(VetCenterMock)

    expect(formattedVetCenter.ccVetCenterFaqs).toBeDefined()
    expect(formattedVetCenter.ccVetCenterFaqs.questions.length).toBeGreaterThan(
      0
    )
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
    ) => ({
      ...VetCenterMock,
      field_mission_explainer: {
        target_type: 'paragraph',
        target_id: '158439',
        target_field: null,
        fetched_bundle: 'magichead_group',
        fetched: {
          field_magichead_body: bodyArray,
          field_magichead_heading: headingArray,
        },
      },
    })

    test('formats mission explainer correctly when data is present', () => {
      const formattedVetCenter = formatter(VetCenterMock)

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

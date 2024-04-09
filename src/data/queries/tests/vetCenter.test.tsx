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
})

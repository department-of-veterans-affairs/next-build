/**
 * @jest-environment node
 */

import { NodeBenefitsDetailPage } from '@/types/drupal/node'
import { formatter } from './query'
import mockData from './mock.json'

const BenefitsDetailPageMock: NodeBenefitsDetailPage =
  mockData as unknown as NodeBenefitsDetailPage

describe('BenefitsDetailPage formatter', () => {
  test('outputs formatted data with correct structure', () => {
    const result = formatter(BenefitsDetailPageMock)

    expect(result).toMatchSnapshot()
    expect(result.title).toBe('Check Your VA Claim or Appeal Status')
    expect(result.entityId).toBe(298)
    expect(result.entityPath).toBe('/check-your-va-claim-or-appeal-status')
    expect(result.description).toBe(
      'Find out how to check the status of a VA claim or appeal online.'
    )
  })

  test('formats intro text correctly', () => {
    const result = formatter(BenefitsDetailPageMock)

    expect(result.introText).toBe(
      '<p>Find out how to check the status of a VA claim or appeal online.</p>\n'
    )
  })

  test('handles table of contents boolean', () => {
    const result = formatter(BenefitsDetailPageMock)

    expect(result.showTableOfContents).toBe(true)
  })

  test('handles null alert', () => {
    const result = formatter(BenefitsDetailPageMock)

    expect(result.alert).toBeNull()
  })

  test('handles null related links', () => {
    const result = formatter(BenefitsDetailPageMock)

    expect(result.relatedLinks).toBeNull()
  })

  // test('formats content blocks', () => {
  //   const result = formatter(BenefitsDetailPageMock)

  //   expect(result.contentBlock).toBeDefined()
  //   expect(Array.isArray(result.contentBlock)).toBe(true)
  // })

  // test('formats featured content', () => {
  //   const result = formatter(BenefitsDetailPageMock)

  //   expect(result.featuredContent).toBeDefined()
  //   expect(Array.isArray(result.featuredContent)).toBe(true)
  // })
})

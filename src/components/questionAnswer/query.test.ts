/**
 * @jest-environment node
 */

import mockData from './mock.json'
import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from './query'
import { DoNotPublishError } from '@/lib/drupal/query'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPage = mockData[0] as any
const mockPageQuery = jest.fn(() => mockPage)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(RESOURCE_TYPES.QA, mockPageQuery)

function runQuery(options: { id?: string } = {}) {
  return queries.getData(RESOURCE_TYPES.QA, {
    id: options.id ?? mockPage.id,
    ...options,
  })
}

describe('QuestionAnswer query module', () => {
  beforeEach(() => {
    mockPageQuery.mockReturnValue(mockPage)
  })

  describe('params', () => {
    test('sets the correct include fields', () => {
      const paramsInstance = params()
      const queryString = decodeURIComponent(paramsInstance.getQueryString())
      expect(queryString).toContain('include=')
      expect(queryString).toMatch(/field_answer/)
      expect(queryString).toMatch(/field_buttons/)
      expect(queryString).toMatch(/field_related_benefit_hubs/)
      expect(queryString).toMatch(/field_related_information/)
      expect(queryString).toMatch(/field_tags/)
      expect(queryString).toMatch(/field_alert_single/)
      expect(queryString).toMatch(/field_contact_information/)
    })
  })

  describe('formatter', () => {
    test('outputs formatted data', async () => {
      expect(await runQuery()).toMatchSnapshot()
    })

    test('throws DoNotPublishError when field_standalone_page is false', async () => {
      mockPageQuery.mockReturnValue({
        ...mockPage,
        field_standalone_page: false,
      })

      await expect(runQuery()).rejects.toThrow(DoNotPublishError)
      await expect(runQuery()).rejects.toThrow(
        'this Q&A is not a standalone page'
      )
    })

    describe('handles null fields', () => {
      test('handles null field_answer', async () => {
        mockPageQuery.mockReturnValue({
          ...mockPage,
          field_answer: null,
        })

        const result = await runQuery()

        expect(result.answers).toBe('')
      })

      test('handles null field_buttons', async () => {
        mockPageQuery.mockReturnValue({
          ...mockPage,
          field_buttons: null,
        })

        const result = await runQuery()

        expect(result.buttons).toBeNull()
      })

      test('handles null field_related_information', async () => {
        mockPageQuery.mockReturnValue({
          ...mockPage,
          field_related_information: null,
        })

        const result = await runQuery()

        expect(result.teasers).toEqual([])
      })

      test('handles null field_alert_single', async () => {
        mockPageQuery.mockReturnValue({
          ...mockPage,
          field_alert_single: null,
        })

        const result = await runQuery()

        expect(result.alert).toBeNull()
      })

      test('handles null field_contact_information', async () => {
        mockPageQuery.mockReturnValue({
          ...mockPage,
          field_contact_information: null,
        })

        const result = await runQuery()

        expect(result.contactInformation).toBeNull()
      })

      test('handles null field_related_benefit_hubs', async () => {
        mockPageQuery.mockReturnValue({
          ...mockPage,
          field_related_benefit_hubs: null,
        })

        const result = await runQuery()

        expect(result.benefitsHubLinks).toEqual([])
      })
    })

    test('formats benefitsHubLinks when present', async () => {
      const result = await runQuery()

      expect(result.benefitsHubLinks).toBeDefined()
      expect(Array.isArray(result.benefitsHubLinks)).toBe(true)
      expect(result.benefitsHubLinks.length).toBeGreaterThan(0)
      expect(result.benefitsHubLinks[0]).toHaveProperty('id')
      expect(result.benefitsHubLinks[0]).toHaveProperty('label')
      expect(result.benefitsHubLinks[0]).toHaveProperty('path')
    })
  })
})

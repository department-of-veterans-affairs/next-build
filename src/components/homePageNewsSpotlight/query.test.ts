/**
 * @jest-environment node
 */

import { data, formatter } from './query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { JsonApiResponse } from 'next-drupal'
import mockData from './mock.json'

// Mock drupalClient
jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    fetch: jest.fn(),
  },
}))

describe('homePageNewsSpotlight query', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL = 'https://test-drupal.example.com'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL = originalEnv
  })

  describe('data', () => {
    it('should fetch data from the correct URL with includes', async () => {
      const mockJsonResponse: JsonApiResponse = {
        jsonapi: { version: '1.0', meta: [] },
        data: [],
        included: [],
        errors: [],
        meta: { count: 1 },
      }

      const mockFetchResponse = {
        json: jest.fn().mockResolvedValue(mockJsonResponse),
      }

      ;(drupalClient.fetch as jest.Mock).mockResolvedValue(mockFetchResponse)

      const result = await data()

      expect(drupalClient.fetch).toHaveBeenCalledTimes(1)

      const callUrl = (drupalClient.fetch as jest.Mock).mock.calls[0][0]
      expect(callUrl).toMatchSnapshot()

      expect(result).toEqual(mockJsonResponse)
    })

    it('should handle fetch errors', async () => {
      const mockError = new Error('Network error')
      ;(drupalClient.fetch as jest.Mock).mockRejectedValue(mockError)

      await expect(data()).rejects.toThrow('Network error')
    })
  })

  describe('formatter', () => {
    it('should format valid data correctly', () => {
      const mockJsonData = mockData as unknown as JsonApiResponse

      const result = formatter(mockJsonData)
      expect(result).toMatchSnapshot()
    })
  })
})

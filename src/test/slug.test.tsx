/**
 * @jest-environment node
 */

import { getStaticProps } from '../pages/[[...slug]]'
import {
  getStaticPropsResource,
  getExpandedStaticPropsContext,
} from '@/lib/drupal/staticProps'
import { DoNotPublishError } from '@/lib/drupal/query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import type { GetStaticPathsContext } from 'next'

jest.mock('@/lib/drupal/staticProps', () => ({
  getExpandedStaticPropsContext: jest.fn(),
  getStaticPropsResource: jest.fn(),
}))

jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    translatePathFromContext: jest.fn(),
    translatePath: jest.fn(),
  },
}))

describe('[[...slug]].tsx', () => {
  describe('getStaticProps', () => {
    const mockContext = { params: { slug: ['test-path'] }, preview: false }
    it('returns notFound when DoNotPublishError is thrown', async () => {
      // Mock the expanded context
      const mockExpandedContext = { drupalPath: '/test-path', preview: false }
      const mockPathInfo = { jsonapi: { resourceName: 'node--event' } }

      // Mock the functions
      ;(getExpandedStaticPropsContext as jest.Mock).mockReturnValue(
        mockExpandedContext
      )
      ;(drupalClient.translatePath as jest.Mock).mockResolvedValue(mockPathInfo)

      // Mock getStaticPropsResource to throw DoNotPublishError
      ;(getStaticPropsResource as jest.Mock).mockImplementation(() => {
        throw new DoNotPublishError('Do not publish error')
      })

      // Call getStaticProps
      const result = await getStaticProps(mockContext)

      // Assert that notFound is returned
      expect(result).toEqual({ notFound: true })

      // Assert that getStaticPropsResource was called
      expect(getStaticPropsResource).toHaveBeenCalled()
    })
  })
})

describe('getStaticPaths', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv, SSG: 'true' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('throws an error when RESOURCE_TYPES_TO_BUILD is empty', async () => {
    // remove all feature flags to ensure RESOURCE_TYPES_TO_BUILD is empty
    const { PAGE_RESOURCE_TYPES } = await import(
      '@/lib/constants/resourceTypes'
    )
    PAGE_RESOURCE_TYPES.forEach((type) => {
      const flag = `FEATURE_NEXT_BUILD_CONTENT_${type.replace(/^node--/, '').toUpperCase()}`
      delete process.env[flag]
    })
    const { getStaticPaths } = await import('@/pages/[[...slug]]')
    await expect(getStaticPaths({} as GetStaticPathsContext)).rejects.toThrow(
      'No resource types returned'
    )
  })
})

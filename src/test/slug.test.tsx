/**
 * @jest-environment node
 */

import { getStaticProps } from '../pages/[...slug]'
import {
  getStaticPropsResource,
  getExpandedStaticPropsContext,
} from '@/lib/drupal/staticProps'
import { DoNotPublishError } from '@/lib/drupal/query'
import { drupalClient } from '@/lib/drupal/drupalClient'

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
    afterEach(() => {
      jest.resetAllMocks()
    })

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

    it('returns notFound when translatePath returns a 403', async () => {
      // Mock the expanded context
      const mockExpandedContext = { drupalPath: '/test-path', preview: false }

      // Mock the functions
      ;(getExpandedStaticPropsContext as jest.Mock).mockReturnValue(
        mockExpandedContext
      )
      ;(drupalClient.translatePath as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch the thing', { cause: { status: 403 } })
      )

      // Call getStaticProps
      const result = await getStaticProps(mockContext)

      // Assert that notFound is returned
      expect(result).toEqual({ notFound: true })

      // Assert that getStaticPropsResource was not called (because it shouldn't
      // have gotten that far)
      expect(getStaticPropsResource).not.toHaveBeenCalled()
    })
  })
})

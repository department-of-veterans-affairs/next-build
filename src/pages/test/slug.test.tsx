/**
 * @jest-environment node
 */

import { getStaticProps } from '../[[...slug]]'
import { getStaticPropsResource } from '@/lib/drupal/staticProps'
import { DoNotPublishError } from '@/lib/drupal/query'

jest.mock('@/lib/drupal/staticProps')

describe('[[...slug]].tsx', () => {
  describe('getStaticProps', () => {
    const mockContext = { params: { slug: ['test-path'] }, preview: false }

    it('handles DoNotPublish error', async () => {
      ;(getStaticPropsResource as jest.Mock).mockRejectedValue(
        new DoNotPublishError('Do not publish error')
      )
      const result = await getStaticProps(mockContext)
      expect(result).toEqual({ notFound: true })
    })
  })
})

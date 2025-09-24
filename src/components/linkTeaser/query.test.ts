/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/linkTeaser/mock.json'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

const linkTeaserMock = mockData as ParagraphLinkTeaser[]

describe('paragraph--link_teaser formatData', () => {
  test('outputs formatted data', () => {
    expect(
      linkTeaserMock.map((linkTeaser) => {
        return queries.formatData('paragraph--link_teaser', linkTeaser)
      })
    ).toMatchSnapshot()
  })
})

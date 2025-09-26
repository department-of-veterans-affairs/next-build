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
      linkTeaserMock.map((linkTeaser) =>
        queries.formatData('paragraph--link_teaser', linkTeaser)
      )
    ).toMatchSnapshot()
  })

  test('returns null if the field_link is null', () => {
    expect(
      queries.formatData('paragraph--link_teaser', {
        ...linkTeaserMock[0],
        field_link: null,
      } as ParagraphLinkTeaser)
    ).toEqual(null)
  })
})

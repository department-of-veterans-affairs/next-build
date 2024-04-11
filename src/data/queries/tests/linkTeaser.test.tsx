/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/linkTeaser.mock.json'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

const linkTeaserMock: ParagraphLinkTeaser[] = mockData

describe('paragraph--link_teaser formatData', () => {
  test('outputs formatted data', () => {
    expect(
      linkTeaserMock.map((linkTeaser) => {
        return queries.formatData('paragraph--link_teaser', linkTeaser)
      })
    ).toMatchSnapshot()
  })
})

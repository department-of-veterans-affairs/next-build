/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/linkTeaserWithImage/mock.json'
import { ParagraphLinkTeaserWithImage } from '@/types/drupal/paragraph'

const linkTeaserMock = mockData as unknown as ParagraphLinkTeaserWithImage
/*
  'as unknown' needed because mockData.field_media.image.drupal_internal__fid is type number, but,
  type DrupalFile['drupal_internal__fid'] is type string
*/

import { formatter } from './query'

describe('paragraph--link_teaser formatData', () => {
  test('outputs formatted data', () => {
    expect(formatter(linkTeaserMock)).toMatchSnapshot()
  })

  test('returns null if the the entity is null or undefined', () => {
    expect(formatter(null)).toEqual(null)
    expect(formatter(undefined)).toEqual(null)
  })
})

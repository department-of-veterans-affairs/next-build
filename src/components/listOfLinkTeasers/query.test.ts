/**
 * @jest-environment node
 */

import { formatter } from '@/components/listOfLinkTeasers/query'
import mockDrupalData from './mock.json'
import mockFormattedData from './mock.formatted'
import { ParagraphListOfLinkTeasers } from '@/types/drupal/paragraph'

describe('paragraph--link_teaser formatData', () => {
  test('outputs formatted data', () => {
    expect(
      formatter(mockDrupalData as unknown as ParagraphListOfLinkTeasers)
    ).toEqual(mockFormattedData)
  })
})

/**
 * @jest-environment node
 */

import { formatter } from '@/components/listOfLinkTeasers/query'
import mockDrupalData from './mock.json'
import mockFormattedData from './mock.formatted'
import { ParagraphListOfLinkTeasers } from '@/types/drupal/paragraph'

describe('paragraph--link_teaser formatData', () => {
  test('outputs formatted data', () => {
    expect(formatter(mockDrupalData as ParagraphListOfLinkTeasers)).toEqual(
      mockFormattedData
    )
  })

  test('returns null if all link teasers are null', () => {
    expect(
      formatter({
        ...mockDrupalData,
        field_va_paragraphs: [null, null],
      } as ParagraphListOfLinkTeasers)
    ).toEqual(null)
  })

  test('filters out null link teasers', () => {
    const formattedData = formatter({
      ...mockDrupalData,
      field_va_paragraphs: [...mockDrupalData.field_va_paragraphs, null],
    } as ParagraphListOfLinkTeasers)
    expect(formattedData.linkTeasers).toHaveLength(
      mockDrupalData.field_va_paragraphs.length
    )
  })

  test('returns null if all link teasers are incomplete', () => {
    const formattedData = formatter({
      ...mockDrupalData,
      field_va_paragraphs: [
        {
          ...mockDrupalData.field_va_paragraphs[0],
          field_link: null,
        },
      ],
    } as ParagraphListOfLinkTeasers)
    expect(formattedData).toEqual(null)
  })
})

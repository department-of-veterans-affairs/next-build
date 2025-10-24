/**
 * @jest-environment node
 */

import { ParagraphSpanishTranslationSummary } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockData from './mock.json'

describe('Spanish Translation Summary formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        PARAGRAPH_RESOURCE_TYPES.SPANISH_TRANSLATION_SUMMARY,
        mockData as ParagraphSpanishTranslationSummary
      )
    ).toMatchSnapshot()
  })
})

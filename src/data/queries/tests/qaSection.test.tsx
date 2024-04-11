/**
 * @jest-environment node
 */

import { ParagraphQaSection } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/qaSection.mock.json'

const QaSectionMock: ParagraphQaSection = mockData

describe('QaSection formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--q_a_section', QaSectionMock)
    ).toMatchSnapshot()
  })
  test('handles null questions correctly', () => {
    const modifiedMock = { ...QaSectionMock, field_questions: null }
    const formattedData = queries.formatData(
      'paragraph--q_a_section',
      modifiedMock
    )
    expect(formattedData.questions).toHaveLength(0)
  })
  test('sets intro to null when field_section_intro is absent or null', () => {
    const modifiedMock = { ...QaSectionMock, field_section_intro: null }
    const formattedDataWithNull = queries.formatData(
      'paragraph--q_a_section',
      modifiedMock
    )
    expect(formattedDataWithNull.intro).toBeNull()
  })
})

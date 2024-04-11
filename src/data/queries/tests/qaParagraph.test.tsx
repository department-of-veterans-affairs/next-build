/**
 * @jest-environment node
 */

import { ParagraphQA } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/qaParagraph.mock.json'

const QaParagraphMock: ParagraphQA = mockData

describe('QaParagraph formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--q_a', QaParagraphMock)
    ).toMatchSnapshot()
  })
  test('handles no answers correctly', () => {
    // Modify mock to simulate no answers
    const noAnswersMock = {
      ...QaParagraphMock,
      field_answer: [], // Testing with an empty array
    }

    const formattedDataEmpty = queries.formatData(
      'paragraph--q_a',
      noAnswersMock
    )
    expect(formattedDataEmpty.answers).toHaveLength(0)

    // Further modify to null if your data structure allows for it
    const nullAnswersMock = {
      ...QaParagraphMock,
      field_answer: null, // Testing with null, if applicable
    }

    const formattedDataNull = queries.formatData(
      'paragraph--q_a',
      nullAnswersMock
    )
    expect(formattedDataNull.answers).toHaveLength(0)
  })
})

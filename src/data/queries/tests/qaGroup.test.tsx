/**
 * @jest-environment node
 */

import { ParagraphQaGroup } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/qaGroup.mock.json'
import { params } from '../qaGroup'

const QaGroupMock: ParagraphQaGroup = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_q_as/)
  })
})

describe('QaGroup formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--q_a_group', QaGroupMock)
    ).toMatchSnapshot()
  })
  test('handles null fields correctly', () => {
    const modifiedMock = {
      ...QaGroupMock,
      field_section_intro: null,
      field_section_header: null,
      field_accordion_display: false,
    }

    const formattedData = queries.formatData(
      'paragraph--q_a_group',
      modifiedMock
    )

    expect(formattedData.intro).toBeNull()
    expect(formattedData.header).toBeNull()
    expect(formattedData.displayAccordion).toBe(false)
  })

  test('filters out unpublished Q&As', () => {
    const mockWithUnpublishedQAs: ParagraphQaGroup = {
      ...QaGroupMock,
      field_q_as: [
        ...QaGroupMock.field_q_as,
        {
          id: 'unpublished',
          title: null,
          field_answer: null,
          type: 'paragraph--q_a',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    }

    const formattedData = queries.formatData(
      'paragraph--q_a_group',
      mockWithUnpublishedQAs
    )
    const hasUnpublishedQA = formattedData.questions.some(
      (q) => q.id === 'unpublished'
    )
    expect(hasUnpublishedQA).toBe(false)
    expect(formattedData.questions.length).toBe(QaGroupMock.field_q_as.length)
  })
})

/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { NodeQA } from '@/types/drupal/node'
import mockData from '@/mocks/questionAnswer.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../questionAnswer'

// Adding this because next-drupal has some bad type definitions.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
const questionAnswerMocks: NodeQA[] = mockData

describe('DrupalJsonApiParams configuration for questionAnswer', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_answer,field_buttons,field_related_benefit_hubs,field_related_information,field_tags.field_topics,field_tags.field_audience_beneficiares,field_tags.field_non_beneficiares/
    )
  })
})

describe(`${RESOURCE_TYPES.QA} formatData`, () => {
  test('outputs formatted data', () => {
    expect(
      questionAnswerMocks.map((mock) => {
        return queries.formatData(RESOURCE_TYPES.QA, mock)
      })
    ).toMatchSnapshot()
  })
})

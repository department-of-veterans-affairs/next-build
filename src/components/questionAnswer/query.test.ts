/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { NodeQA } from '@/types/drupal/node'
import mockData from '@/components/questionAnswer/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from './query'

// Adding this because next-drupal has some bad type definitions.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
const questionAnswerMocks: NodeQA[] = mockData

describe('DrupalJsonApiParams configuration for questionAnswer', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toContain('include=')
    expect(queryString).toMatch(/field_answer/)
    expect(queryString).toMatch(/field_buttons/)
    expect(queryString).toMatch(/field_related_benefit_hubs/)
    expect(queryString).toMatch(/field_related_information/)
    expect(queryString).toMatch(/field_tags/)
    expect(queryString).toMatch(/field_alert_single/)
    expect(queryString).toMatch(/field_contact_information/)
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

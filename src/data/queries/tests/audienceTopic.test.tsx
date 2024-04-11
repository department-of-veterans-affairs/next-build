/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { ParagraphAudienceTopics } from '@/types/drupal/paragraph'
import mockData from '@/mocks/audienceTopics.mock.json'
import { params, getTagsList } from '../audienceTopics'

// Adding this because next-drupal has some bad type definitions.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
const audienceTopicsMocks: ParagraphAudienceTopics[] = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_audience_beneficiares,field_non_beneficiares,field_topics/
    )
  })
})

describe('paragraph--audience_topics formatData', () => {
  test('outputs formatted data', () => {
    expect(
      audienceTopicsMocks.map((mock) => {
        return queries.formatData('paragraph--audience_topics', mock)
      })
    ).toMatchSnapshot()
  })
})

describe('getTagsList', () => {
  test('returns null if no entity provied', () => {
    const result = getTagsList(null)
    expect(result).toBeNull()
  })
})

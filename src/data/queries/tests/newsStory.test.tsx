/**
 * @jest-environment node
 */

import { NodeNewsStory } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/newsStory.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../newsStory'

const nodeNewsStoryMock: NodeNewsStory = mockData

describe(`${RESOURCE_TYPES.STORY} formatData`, () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.STORY, nodeNewsStoryMock)
    ).toMatchSnapshot()
  })
  test('handles missing or null fields correctly', () => {
    const modifiedMock = {
      ...nodeNewsStoryMock,
      field_author: null,
      field_administration: undefined,
    }

    const formattedData = queries.formatData(RESOURCE_TYPES.STORY, modifiedMock)
    expect(formattedData.author).toBeNull()
    expect(formattedData.administration.id).toBeNull()
    expect(formattedData.administration.name).toBeNull()
  })
})

describe('DrupalJsonApiParams configuration for newsStory', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_media,field_media.image,field_author,field_listing,field_administration/
    )
  })
})

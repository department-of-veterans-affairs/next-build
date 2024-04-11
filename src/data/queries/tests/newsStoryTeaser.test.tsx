/**
 * @jest-environment node
 */

import { NodeNewsStory } from '@/types/drupal/node'
import mockData from '@/mocks/newsStory.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params, formatter } from '../newsStoryTeaser'

const nodeNewsStoryMock: NodeNewsStory = mockData

describe(`${RESOURCE_TYPES.STORY}Teaser formatData`, () => {
  test('outputs formatted data', () => {
    const formattedData = formatter(nodeNewsStoryMock)
    expect(formattedData).toMatchSnapshot()
  })

  test('handles missing or null fields correctly', () => {
    const modifiedMock = {
      ...nodeNewsStoryMock,
      field_media: null,
      field_listing: undefined,
    }

    const formattedData = formatter(modifiedMock)
    expect(formattedData.image).toBeNull()
    expect(formattedData.link).toBe(modifiedMock.path.alias)
  })
})

describe('DrupalJsonApiParams configuration for newsStoryTeaser', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_media,field_media.image,field_listing/
    )
  })
})

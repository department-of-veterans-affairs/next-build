/**
 * @jest-environment node
 */

import { NodeNewsStory } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/newsStory/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params, formatter } from './query'

const nodeNewsStoryMock = mockData as NodeNewsStory

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
    expect(formattedData.administration.entityId).toBeNull()
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

describe('newsStory formatter applies content formatting', () => {
  test('applies getHtmlFromDrupalContent to bodyContent', () => {
    const mockWithH2 = {
      ...nodeNewsStoryMock,
      field_full_story: '<h2>Test Heading</h2><p>Some content</p>',
    }
    const formattedData = formatter(mockWithH2)
    // Verify H2 IDs are added (proves formatting is applied)
    expect(formattedData.bodyContent).toContain('id="test-heading"')
  })
})

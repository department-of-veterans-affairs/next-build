/**
 * @jest-environment node
 */

import {
  params as storyListingParams,
  listingParams,
  data,
} from '../storyListing'
import * as queryModule from '@/lib/drupal/query'

jest.mock('@/lib/drupal/query', () => {
  const mockEntity = {
    id: 'test-story-listing-id',
    type: 'node--story_listing',
    attributes: {},
    langcode: 'en',
    status: true,
    field_office: {
      field_system_menu: {
        resourceIdObjMeta: {
          drupal_internal__target_id: '1111-1111-1111',
        },
      },
    },
  }

  const mockMenu = {
    items: [],
    tree: [],
  }

  return {
    fetchSingleEntityOrPreview: jest.fn().mockResolvedValue(mockEntity),
    fetchAndConcatAllResourceCollectionPages: jest
      .fn()
      .mockResolvedValue({ data: [], totalItems: 0, totalPages: 0 }),
    getMenu: jest.fn().mockResolvedValue(mockMenu),
    entityBaseFields: jest.fn().mockReturnValue({}),
  }
})

describe('data function for StoryListing', () => {
  test('invokes data function with mocked dependencies', async () => {
    const opts = { id: 'test-id' }
    const result = await data(opts)

    expect(result).toHaveProperty('entity')
    expect(result).toHaveProperty('stories', [])
    expect(result).toHaveProperty('totalItems', 0)
    expect(result).toHaveProperty('totalPages', 0)
    expect(queryModule.fetchSingleEntityOrPreview).toHaveBeenCalledWith(
      opts,
      expect.anything(),
      expect.anything()
    )
    expect(
      queryModule.fetchAndConcatAllResourceCollectionPages
    ).toHaveBeenCalled()
    expect(queryModule.getMenu).toHaveBeenCalled()
  })

  describe('DrupalJsonApiParams configuration for StoryListing', () => {
    test('params function sets the correct include fields', () => {
      const paramsInstance = storyListingParams()
      const queryString = decodeURIComponent(paramsInstance.getQueryString())
      expect(queryString).toContain('field_office')
    })
  })

  describe('listingParams for fetching stories', () => {
    test('correctly constructs query parameters', () => {
      const listingEntityId = '123'
      const paramsInstance = listingParams(listingEntityId)
      const queryString = decodeURIComponent(paramsInstance.getQueryString())
      expect(queryString).toContain(
        'filter[field_listing.id]=' + listingEntityId
      )
      expect(queryString).toContain('sort=-created')
    })
  })
})

/**
 * @jest-environment node
 */

import {
  params as pressReleaseListingParams,
  listingParams,
  data,
} from '../pressReleaseListing'
import * as queryModule from '@/lib/drupal/query'

jest.mock('@/lib/drupal/query', () => {
  const mockEntity = {
    id: 'c0d78f6e-3787-42e8-a7b2-fb81f6587059',
    type: 'node--press_releases_listing',
    attributes: {},
    langcode: 'en',
    status: true,
    field_office: {
      field_system_menu: {
        resourceIdObjMeta: {
          drupal_internal__target_id: 'va-birmingham-health-care',
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

describe('data function for PressReleaseListing', () => {
  test('invokes data function with mocked dependencies', async () => {
    const opts = { id: 'test-id' }
    const result = await data(opts)

    expect(result).toHaveProperty('entity')
    expect(result).toHaveProperty('releases', [])
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

  describe('DrupalJsonApiParams configuration for pressReleaseListing', () => {
    test('params function sets the correct include fields', () => {
      const paramsInstance = pressReleaseListingParams()
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

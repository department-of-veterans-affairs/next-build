/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import mockPage from './mock.json'
import mockAssets from './mock.assets.json'
import { NodePublicationListing, NodeOutreachAsset } from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'
import {
  OutreachAssetImageMedia,
  OutreachAssetVideoMedia,
} from './formatted-type'
import { DrupalMediaImage } from '@/types/drupal/media'

const mockPageQuery = jest.fn(
  () => mockPage as unknown as NodePublicationListing
)
const mockAssetsQuery = jest.fn(() => ({
  data: mockAssets as unknown as NodeOutreachAsset[],
}))

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.PUBLICATION_LISTING,
  mockPageQuery
)
mockDrupalQuery.setResourceCollectionMock(
  RESOURCE_TYPES.OUTREACH_ASSET,
  mockAssetsQuery
)

function runQuery() {
  return queries.getData(RESOURCE_TYPES.PUBLICATION_LISTING, {
    id: mockPage.id,
  })
}

describe('OutreachMaterials query', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockPageQuery.mockReturnValue(mockPage as unknown as NodePublicationListing)
    mockAssetsQuery.mockReturnValue({
      data: mockAssets as unknown as NodeOutreachAsset[],
    })
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  test('handles null intro_text', async () => {
    mockPageQuery.mockReturnValue({
      ...mockPage,
      field_intro_text: null,
    } as unknown as NodePublicationListing)

    const result = await runQuery()

    expect(result.introText).toBeNull()
  })

  test('filters out assets without media', async () => {
    const assetWithoutMedia = mockAssets[3] as unknown as NodeOutreachAsset
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockAssetsQuery.mockReturnValue({
      data: [assetWithoutMedia, mockAssets[0] as unknown as NodeOutreachAsset],
    })

    const result = await runQuery()

    // Should only include the asset with valid media
    expect(result.outreachAssets).toHaveLength(1)
    expect(result.outreachAssets[0].id).toBe('asset-1')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unknown media type',
      assetWithoutMedia.field_media
    )

    consoleSpy.mockRestore()
  })

  test('filters out assets with unknown media types', async () => {
    const assetWithUnknownMedia = {
      ...mockAssets[0],
      field_media: {
        type: 'media--unknown',
        id: 'unknown-media',
      },
    } as unknown as NodeOutreachAsset
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockAssetsQuery.mockReturnValue({
      data: [
        assetWithUnknownMedia,
        mockAssets[0] as unknown as NodeOutreachAsset,
      ],
    })

    const result = await runQuery()

    // Should only include the valid asset
    expect(result.outreachAssets).toHaveLength(1)
    expect(result.outreachAssets[0].id).toBe('asset-1')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unknown media type',
      assetWithUnknownMedia.field_media
    )

    consoleSpy.mockRestore()
  })

  test('handles null format field', async () => {
    const assetWithoutFormat = {
      ...mockAssets[0],
      field_format: null,
    } as unknown as NodeOutreachAsset
    mockAssetsQuery.mockReturnValue({
      data: [assetWithoutFormat],
    })

    const result = await runQuery()

    expect(result.outreachAssets[0].format).toBe('')
  })

  test('handles empty description', async () => {
    const assetWithEmptyDesc = {
      ...mockAssets[0],
      field_description: '',
    } as unknown as NodeOutreachAsset
    mockAssetsQuery.mockReturnValue({
      data: [assetWithEmptyDesc],
    })

    const result = await runQuery()

    expect(result.outreachAssets[0].description).toBe('')
  })

  test('extracts and deduplicates topics correctly', async () => {
    const result = await runQuery()

    // Should have unique topics sorted alphabetically
    expect(result.topics).toHaveLength(3)
    expect(result.topics[0].name).toBe('Benefits')
    expect(result.topics[0].topicId).toBe('benefits-001')
    expect(result.topics[1].name).toBe('Education')
    expect(result.topics[1].topicId).toBe('education-001')
    expect(result.topics[2].name).toBe('Health Care')
    expect(result.topics[2].topicId).toBe('health-001')
  })

  test('sorts topics alphabetically by name', async () => {
    const result = await runQuery()

    const topicNames = result.topics.map((t) => t.name.toLowerCase())
    const sortedNames = [...topicNames].sort((a, b) => a.localeCompare(b))

    expect(topicNames).toEqual(sortedNames)
  })

  test('filters out categories with empty topic IDs', async () => {
    const assetWithEmptyTopicId = mockAssets[4] as unknown as NodeOutreachAsset
    mockAssetsQuery.mockReturnValue({
      data: [assetWithEmptyTopicId],
    })

    const result = await runQuery()

    expect(result.outreachAssets[0].categories).toHaveLength(0)
  })

  test('stores only topic IDs in asset categories', async () => {
    const result = await runQuery()

    // Asset 1 has two categories with topic IDs
    const asset1 = result.outreachAssets.find((a) => a.id === 'asset-1')
    expect(asset1?.categories).toEqual(['benefits-001', 'health-001'])
  })

  test('handles empty assets array', async () => {
    mockAssetsQuery.mockReturnValue({
      data: [],
    })

    const result = await runQuery()

    expect(result.outreachAssets).toHaveLength(0)
    expect(result.topics).toHaveLength(0)
  })

  test('handles null field_lc_categories', async () => {
    const assetWithNullCategories = {
      ...mockAssets[0],
      field_lc_categories: null,
    } as unknown as NodeOutreachAsset
    mockAssetsQuery.mockReturnValue({
      data: [assetWithNullCategories],
    })

    const result = await runQuery()

    expect(result.outreachAssets[0].categories).toEqual([])
  })

  test('handles missing image alt text', async () => {
    const imageAssetWithoutAlt = {
      ...mockAssets[1],
      field_media: {
        ...mockAssets[1].field_media,
        image: {
          ...(mockAssets[1].field_media as unknown as DrupalMediaImage).image,
          resourceIdObjMeta: {},
        },
      },
    } as unknown as NodeOutreachAsset
    mockAssetsQuery.mockReturnValue({
      data: [imageAssetWithoutAlt],
    })

    const result = await runQuery()

    const media = result.outreachAssets[0].media as OutreachAssetImageMedia
    expect(media.imageAlt).toBe('')
  })

  test('handles missing video thumbnail', async () => {
    const videoAssetWithoutThumbnail = {
      ...mockAssets[2],
      field_media: {
        ...mockAssets[2].field_media,
        thumbnail: undefined,
      },
    } as unknown as NodeOutreachAsset
    mockAssetsQuery.mockReturnValue({
      data: [videoAssetWithoutThumbnail],
    })

    const result = await runQuery()

    const media = result.outreachAssets[0].media as OutreachAssetVideoMedia
    expect(media.videoThumbnailUrl).toBeNull()
  })
})

/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/banners.mock.json'
import { BANNER_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { data } from '../banners'
import { drupalClient } from '@/lib/drupal/drupalClient'

const nodeBannerMock = mockData

describe('data function for banner data fetching', () => {
  test('returns an empty array when itemPath is not provided', async () => {
    const result = await data({})
    expect(result).toEqual([])
  })
})

jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    fetch: jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: mockData }),
    }),
  },
}))

test('fetches banners when itemPath is provided', async () => {
  const result = await data({ itemPath: '/test-path' })
  expect(result).toEqual(mockData)
  expect(drupalClient.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/test-path')
  )
})

describe('Banners return formatted data', () => {
  test('outputs formatted data for BASIC banner type', () => {
    const basicBanner = nodeBannerMock.find(
      (banner) => banner.type.target_id === BANNER_RESOURCE_TYPES.BASIC
    )
    expect(basicBanner).toBeDefined()

    const formattedData = queries.formatData('banner-data', [basicBanner])
    expect(formattedData[0].type).toBe(BANNER_RESOURCE_TYPES.BASIC)
    expect(formattedData).toMatchSnapshot()
  })

  test('outputs formatted data for PROMO banner type', () => {
    const promoBanner = nodeBannerMock.find(
      (banner) => banner.type.target_id === BANNER_RESOURCE_TYPES.PROMO
    )
    expect(promoBanner).toBeDefined()

    const formattedData = queries.formatData('banner-data', [promoBanner])
    expect(formattedData[0].type).toBe(BANNER_RESOURCE_TYPES.PROMO)
    expect(formattedData).toMatchSnapshot()
  })

  test('outputs formatted data for FACILITY banner type', () => {
    const facilityBanner = nodeBannerMock.find(
      (banner) => banner.type.target_id === BANNER_RESOURCE_TYPES.FACILITY
    )
    expect(facilityBanner).toBeDefined()

    const formattedData = queries.formatData('banner-data', [facilityBanner])
    expect(formattedData[0].type).toBe(BANNER_RESOURCE_TYPES.FACILITY)
    expect(formattedData).toMatchSnapshot()
  })

  test('returns null for unsupported banner type', () => {
    const unsupportedBanner = {
      ...nodeBannerMock.find(
        (banner) => banner.type.target_id === BANNER_RESOURCE_TYPES.BASIC
      ),
      type: { target_id: 'UNSUPPORTED_TYPE' },
    }

    const formattedData = queries.formatData('banner-data', [unsupportedBanner])
    expect(formattedData).toEqual([null])
  })
})

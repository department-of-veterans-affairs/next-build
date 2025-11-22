/**
 * @jest-environment node
 */

import mockVetCenterLocationListing from './mock.json'
import mockCap from './mock.vetCenterCap.json'
import mockOutstation from '@/components/vetCenterOutstation/mock.json'
import { queries } from '@/lib/drupal/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const mockVetCenterLocationListingQuery = jest.fn()
const mockCapQuery = jest.fn()
const mockOutstationQuery = jest.fn()
const mockMobileVetCentersQuery = jest.fn()

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')
mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING,
  mockVetCenterLocationListingQuery
)
mockDrupalQuery.setResourceCollectionMock('node--vet_center_cap', mockCapQuery)
mockDrupalQuery.setResourceCollectionMock(
  'node--vet_center_outstation',
  mockOutstationQuery
)
mockDrupalQuery.setResourceCollectionMock(
  'node--vet_center_mobile_vet_center',
  mockMobileVetCentersQuery
)

function getData() {
  return queries.getData(RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING, {
    id: mockVetCenterLocationListing.id,
  })
}

describe('VetCenterLocationListing query', () => {
  beforeEach(() => {
    // Reset mocks to default behavior before each test
    mockVetCenterLocationListingQuery.mockReturnValue(
      mockVetCenterLocationListing
    )
    mockCapQuery.mockReturnValue({
      data: [mockCap],
    })
    mockOutstationQuery.mockReturnValue({
      data: [mockOutstation],
    })
    mockMobileVetCentersQuery.mockReturnValue({
      data: [],
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('fetches and returns formatted VetCenterLocationListing data', async () => {
    const result = await getData()

    expect(result).toBeDefined()
    expect(result.title).toBe(mockVetCenterLocationListing.title)
    expect(result.mainOffice).toBeDefined()
    expect(result.mainOffice.title).toBe(
      mockVetCenterLocationListing.field_office.title
    )
    expect(result.nearbyMobileVetCenters).toBeDefined()
    expect(Array.isArray(result.nearbyMobileVetCenters)).toBe(true)
    expect(result.mobileVetCenters).toBeDefined()
    expect(Array.isArray(result.mobileVetCenters)).toBe(true)
    expect(result.satelliteLocations).toBeDefined()
    expect(Array.isArray(result.satelliteLocations)).toBe(true)
  })

  describe('mainOffice functionality', () => {
    test('formats mainOffice correctly when data is present', async () => {
      const result = await getData()

      expect(result.mainOffice).toBeDefined()
      expect(result.mainOffice.title).toBe(
        mockVetCenterLocationListing.field_office.title
      )
      expect(result.mainOffice.officialName).toBe(
        mockVetCenterLocationListing.field_office.field_official_name
      )
      expect(result.mainOffice.phoneNumber).toBe(
        mockVetCenterLocationListing.field_office.field_phone_number
      )
      expect(result.mainOffice.address).toBeDefined()
      expect(result.mainOffice.officeHours).toBeDefined()
      expect(Array.isArray(result.mainOffice.officeHours)).toBe(true)
    })
  })

  describe('nearbyMobileVetCenters functionality', () => {
    test('formats nearbyMobileVetCenters correctly when data is present', async () => {
      const result = await getData()

      expect(result.nearbyMobileVetCenters).toBeDefined()
      expect(Array.isArray(result.nearbyMobileVetCenters)).toBe(true)

      // Mock data should have nearby mobile vet centers, so we can expect them to be present
      expect(result.nearbyMobileVetCenters.length).toBeGreaterThan(0)

      const firstMobileCenter = result.nearbyMobileVetCenters[0]
      expect(firstMobileCenter).toHaveProperty('title')
      expect(firstMobileCenter).toHaveProperty('phoneNumber')
      expect(firstMobileCenter).toHaveProperty('address')
      expect(firstMobileCenter).toHaveProperty('type')
      expect(firstMobileCenter.type).toBe('node--vet_center_mobile_vet_center')
    })

    test('handles empty array', async () => {
      // Create custom mock for this test
      const mockWithEmptyNearbyMobileVetCenters = {
        ...mockVetCenterLocationListing,
        field_nearby_mobile_vet_centers: [],
      }

      mockVetCenterLocationListingQuery.mockReturnValue(
        mockWithEmptyNearbyMobileVetCenters
      )

      const result = await getData()

      expect(result.nearbyMobileVetCenters).toEqual([])
    })
  })

  describe('Mobile Vet Centers functionality', () => {
    test('formats mobile vet centers correctly when data is present', async () => {
      // Mock satellite locations query to return mobile vet centers
      const mockMobileVetCenterData = [
        {
          type: 'node--vet_center_mobile_vet_center',
          id: 'test-mobile-vet-center',
          title: 'Test Mobile Vet Center',
          field_phone_number: '555-123-4567',
          field_address: {
            address_line1: '123 Test St',
            locality: 'Test City',
            administrative_area: 'TS',
            postal_code: '12345',
          },
          field_media: null,
          field_facility_locator_api_id: 'test_api_id',
          path: { alias: '/test-mobile-vet-center' },
        },
      ]

      mockMobileVetCentersQuery.mockReturnValue({
        data: mockMobileVetCenterData,
      })

      const result = await getData()

      expect(result.mobileVetCenters).toBeDefined()
      expect(Array.isArray(result.mobileVetCenters)).toBe(true)

      // Mock data should have mobile vet centers, so we can expect them to be present
      expect(result.mobileVetCenters.length).toBeGreaterThan(0)

      const firstMobileCenter = result.mobileVetCenters[0]
      expect(firstMobileCenter).toHaveProperty('title')
      expect(firstMobileCenter).toHaveProperty('phoneNumber')
      expect(firstMobileCenter).toHaveProperty('address')
      expect(firstMobileCenter).toHaveProperty('type')
      expect(firstMobileCenter.type).toBe('node--vet_center_mobile_vet_center')
    })

    test('handles empty array', async () => {
      mockMobileVetCentersQuery.mockReturnValue({
        data: [],
      })

      const result = await getData()

      expect(result.mobileVetCenters).toEqual([])
    })
  })

  describe('Satellite locations functionality', () => {
    test('handles empty array', async () => {
      mockCapQuery.mockReturnValue({
        data: [],
      })
      mockOutstationQuery.mockReturnValue({
        data: [],
      })

      const result = await getData()

      expect(result.satelliteLocations).toEqual([])
    })
  })
})

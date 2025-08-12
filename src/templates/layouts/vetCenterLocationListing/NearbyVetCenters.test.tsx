import React from 'react'
import { render } from '@testing-library/react'
import { NearbyVetCenters } from './NearbyVetCenters'
import { formatter } from '@/data/queries/vetCenterLocationListing'
import drupalMockData from '@/mocks/vetCenterLocationListing.mock.json'
import mockCap from '@/mocks/vetCenterCap.mock.json'
import mockOutstation from '@/mocks/vetCenterOutstation.mock.json'
import { NodeVetCenterCap } from '@/types/drupal/node'
import { NodeVetCenterOutstation } from '@/types/drupal/node'

// Restructure mock data to match expected format
const mockData = formatter({
  entity: drupalMockData,
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  caps: [mockCap as NodeVetCenterCap],
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  outstations: [mockOutstation as NodeVetCenterOutstation],
  mobileVetCenters: [],
})

const mockMainOffice = mockData.mainOffice
const mockSatelliteLocations = mockData.satelliteLocations

// Mock window object
Object.defineProperty(window, 'mainVetCenterPhone', {
  value: '',
  writable: true,
})
Object.defineProperty(window, 'mainVetCenterAddress', {
  value: {},
  writable: true,
})
Object.defineProperty(window, 'mainVetCenterId', {
  value: '',
  writable: true,
})
Object.defineProperty(window, 'satteliteVetCenters', {
  value: [],
  writable: true,
})

describe('NearbyVetCenters', () => {
  const mockProps = {
    mainOffice: mockMainOffice,
    satelliteLocations: mockSatelliteLocations,
  }

  beforeEach(() => {
    // Reset window properties before each test to undefined (more accurate initial state)
    window.mainVetCenterPhone = undefined
    window.mainVetCenterAddress = undefined
    window.mainVetCenterId = undefined
    window.satteliteVetCenters = undefined
  })

  it('renders the widget container', () => {
    const { container } = render(<NearbyVetCenters {...mockProps} />)
    const widgetDiv = container.querySelector(
      '[data-widget-type="vet-center-nearby"]'
    )
    expect(widgetDiv).toBeInTheDocument()
  })

  it('sets up window variables with the provided props', () => {
    render(<NearbyVetCenters {...mockProps} />)

    expect(window.mainVetCenterPhone).toBe(mockMainOffice.phoneNumber)
    expect(window.mainVetCenterAddress).toEqual(mockMainOffice.address)
    expect(window.mainVetCenterId).toBe(
      mockMainOffice.fieldFacilityLocatorApiId
    )
    expect(window.satteliteVetCenters).toEqual(
      mockSatelliteLocations.map(
        (location) => location.fieldFacilityLocatorApiId
      )
    )
  })

  it('handles optional address fields', () => {
    const propsWithOptionalFields = {
      ...mockProps,
      mainOffice: {
        ...mockMainOffice,
        address: {
          langcode: 'en',
          country_code: 'US',
          administrative_area: 'CO',
          locality: 'Denver',
          // postal_code and address_line1 are optional
        },
      },
    }

    render(<NearbyVetCenters {...propsWithOptionalFields} />)

    expect(window.mainVetCenterAddress).toEqual(
      propsWithOptionalFields.mainOffice.address
    )
  })
})

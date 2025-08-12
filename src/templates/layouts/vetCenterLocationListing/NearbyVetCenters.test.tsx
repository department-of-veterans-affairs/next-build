import React from 'react'
import { render } from '@testing-library/react'
import { NearbyVetCenters } from './NearbyVetCenters'
import { VetCenterLocationListing } from '@/types/formatted/vetCenterLocationListing'

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
  const mockMainOffice = {
    id: 'test-id',
    type: 'node--vet_center' as const,
    title: 'Test Vet Center',
    path: '/test-vet-center',
    published: true,
    lastUpdated: '2024-01-01T00:00:00Z',
    address: {
      langcode: 'en',
      country_code: 'US',
      administrative_area: 'CO',
      locality: 'Colorado Springs',
      postal_code: '80907',
      address_line1: '3920 North Union Blvd',
      address_line2: 'Suite 310',
    },
    geolocation: null,
    lastSavedByAnEditor: null,
    image: null,
    fieldFacilityLocatorApiId: 'vc_0525V',
    officialName: 'Test Vet Center',
    phoneNumber: '555-123-4567',
    officeHours: [],
    operatingStatusFacility: 'normal' as const,
    operatingStatusMoreInfo: null,
  }

  const mockSatelliteLocations = [
    {
      id: 'satellite-1',
      type: 'node--vet_center_cap' as const,
      title: 'Satellite Location 1',
      path: '/satellite-1',
      published: true,
      lastUpdated: '2024-01-01T00:00:00Z',
      address: {
        langcode: 'en',
        country_code: 'US',
        administrative_area: 'CO',
        locality: 'Denver',
        postal_code: '80202',
        address_line1: '123 Test St',
      },
      geolocation: null,
      lastSavedByAnEditor: null,
      image: null,
      fieldFacilityLocatorApiId: 'vc_0836MVC',
      geographicalIdentifier: 'DEN',
      vetcenterCapHoursOptIn: true,
      operatingStatusFacility: 'normal' as const,
      operatingStatusMoreInfo: null,
    },
  ]

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

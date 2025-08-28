import React from 'react'
import { render, screen } from '@testing-library/react'
import { VetCenterLocationListing } from './template'
import { formatter } from './query'
import drupalMockData from './mock.json'
import mockCap from './mock.vetCenterCap.json'
import mockOutstation from '@/components/vetCenterOutstation/mock.json'
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

describe('VetCenterLocationListing with valid data', () => {
  test('renders VetCenterLocationListing component', () => {
    render(<VetCenterLocationListing {...mockData} />)

    expect(screen.queryByText(/Locations/)).toBeInTheDocument()
  })

  describe('Section headings', () => {
    test('renders main location heading', () => {
      render(<VetCenterLocationListing {...mockData} />)

      expect(
        screen.getByRole('heading', { level: 2, name: /main location/i })
      ).toBeInTheDocument()
    })

    test('renders satellite locations heading when satellite locations exist', () => {
      render(<VetCenterLocationListing {...mockData} />)

      expect(
        screen.getByRole('heading', { level: 2, name: /satellite locations/i })
      ).toBeInTheDocument()
    })

    test('renders vet centers in other areas heading', () => {
      render(<VetCenterLocationListing {...mockData} />)

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /vet centers in other areas/i,
        })
      ).toBeInTheDocument()
    })

    test('does not render satellite locations heading when no satellite locations exist', () => {
      const mockDataNoSatellites = {
        ...mockData,
        satelliteLocations: [],
        nearbyMobileVetCenters: [],
        mobileVetCenters: [],
      }
      render(<VetCenterLocationListing {...mockDataNoSatellites} />)

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /satellite locations/i,
        })
      ).not.toBeInTheDocument()
    })
  })

  describe('Main office display', () => {
    test('renders main office information', () => {
      render(<VetCenterLocationListing {...mockData} />)

      // Check for main office title within va-link using data attributes
      const titleLinkElement = document.querySelector(
        'va-link[text="Colorado Springs Vet Center"]'
      )
      expect(titleLinkElement).toBeInTheDocument()
      expect(titleLinkElement).toHaveAttribute(
        'href',
        '/colorado-springs-vet-center'
      )

      // Check for address information
      expect(screen.getByText(/3920 North Union Blvd/)).toBeInTheDocument()
      expect(screen.getByText(/Colorado Springs, CO 80907/)).toBeInTheDocument()
    })

    test('renders main office phone number', () => {
      render(<VetCenterLocationListing {...mockData} />)

      // Phone number is rendered as va-telephone element
      const phoneElement = document.querySelector(
        'va-telephone[contact="7194719992"]'
      )
      expect(phoneElement).toBeInTheDocument()
    })
  })

  describe('Satellite vet center types', () => {
    test('renders CAP (Community Access Point) location', () => {
      render(<VetCenterLocationListing {...mockData} />)

      // Check for CAP location title
      expect(
        screen.getByText(/Little Rock Vet Center - Mountain Home/)
      ).toBeInTheDocument()

      // Check for CAP address with organization (when organization exists)
      expect(
        screen.getByText(/St. Peter the Fisherman Church/)
      ).toBeInTheDocument()
      expect(screen.getByText(/249 Dyer St/)).toBeInTheDocument()

      // Check for CAP-specific operating status info
      expect(
        screen.getByText(/Counseling services, including a PTSD support group/)
      ).toBeInTheDocument()
    })

    test('renders outstation location', () => {
      render(<VetCenterLocationListing {...mockData} />)

      // Check for outstation title
      expect(
        screen.getByText(/Sepulveda Vet Center Outstation/)
      ).toBeInTheDocument()

      // Check for outstation address
      expect(screen.getByText(/9737 Haskell Ave/)).toBeInTheDocument()
    })

    test('renders nearby mobile vet center', () => {
      render(<VetCenterLocationListing {...mockData} />)

      // Check for nearby mobile vet center title
      expect(screen.getByText(/Pueblo Mobile Vet Center/)).toBeInTheDocument()

      // Mobile vet centers should not display addresses
      expect(
        screen.queryByText(/1515 Fortino Boulevard/)
      ).not.toBeInTheDocument()
    })
  })

  describe('Find locations link', () => {
    test('renders find vet center location link', () => {
      render(<VetCenterLocationListing {...mockData} />)

      // Look for the va-link element with the correct text and href using querySelector
      const linkElement = document.querySelector(
        'va-link[text="Find a Vet Center location"]'
      )
      expect(linkElement).toBeInTheDocument()
      expect(linkElement).toHaveAttribute('href', '/find-locations')
    })
  })

  describe('Global variables for nearby vet centers widget', () => {
    beforeEach(() => {
      // Reset window properties before each test to undefined (more accurate initial state)
      window.mainVetCenterPhone = undefined
      window.mainVetCenterAddress = undefined
      window.mainVetCenterId = undefined
      window.satteliteVetCenters = undefined
    })

    test('sets up window variables with the provided props', () => {
      render(<VetCenterLocationListing {...mockData} />)

      expect(window.mainVetCenterPhone).toBe(mockData.mainOffice.phoneNumber)
      expect(window.mainVetCenterAddress).toMatchSnapshot()
      expect(window.mainVetCenterId).toBe(
        mockData.mainOffice.fieldFacilityLocatorApiId
      )
      expect(window.satteliteVetCenters).toEqual(
        mockData.satelliteLocations.map(
          (location) => location.fieldFacilityLocatorApiId
        )
      )
    })
  })
})

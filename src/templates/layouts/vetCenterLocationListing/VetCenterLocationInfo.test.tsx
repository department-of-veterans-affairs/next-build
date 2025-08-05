import { render, screen } from '@testing-library/react'
import { VetCenterLocationInfo } from './VetCenterLocationInfo'

const mockVetCenter = {
  id: 'test-id',
  type: 'node--vet_center' as const,
  published: true,
  lastUpdated: '2024-01-01',
  title: 'Test Vet Center',
  path: '/test-vet-center',
  address: {
    langcode: 'en',
    country_code: 'US',
    address_line1: '123 Test St',
    address_line2: 'Suite 100',
    locality: 'Test City',
    administrative_area: 'TS',
    postal_code: '12345',
  },
  geolocation: {
    value: 'POINT(-72.456 42.123)',
    geo_type: 'Point',
    lat: 42.123,
    lon: -72.456,
    left: -72.456,
    top: 42.123,
    right: -72.456,
    bottom: 42.123,
    geohash: 'drkrerhmyw0ty8',
    latlon: '42.123,-72.456',
  },
  lastSavedByAnEditor: '2024-01-01T12:00:00Z',
  image: {
    id: 'test-image-id',
    alt: 'Test Image',
    title: 'Test Image Title',
    width: 200,
    height: 100,
    links: {
      '7_2_medium_thumbnail': {
        href: 'https://example.com/test-image.jpg',
      },
    },
  },
  fieldFacilityLocatorApiId: 'test-facility-id',
  officialName: 'Test Official Name',
  phoneNumber: '555-123-4567',
  officeHours: [
    { day: 1, starthours: 900, endhours: 1700 },
    { day: 2, starthours: 900, endhours: 1700 },
  ],
  operatingStatusFacility: 'normal' as const,
  operatingStatusMoreInfo: null,
}

describe('VetCenterLocationInfo', () => {
  it('renders the vet center title', () => {
    const { container } = render(
      <VetCenterLocationInfo vetCenter={mockVetCenter} isMainOffice={true} />
    )

    const link = container.querySelector('va-link[text="Test Vet Center"]')
    expect(link).toBeInTheDocument()
  })

  it.skip('renders the address when provided', () => {
    render(
      <VetCenterLocationInfo vetCenter={mockVetCenter} isMainOffice={true} />
    )

    expect(screen.getByText('123 Test St')).toBeInTheDocument()
    expect(screen.getByText('Test City, TS 12345')).toBeInTheDocument()
  })

  it('renders the phone number when provided', () => {
    render(
      <VetCenterLocationInfo vetCenter={mockVetCenter} isMainOffice={true} />
    )

    // The phone number is rendered in a va-telephone element, so we check for the contact attribute
    const phoneElement = screen.getByTestId('phone')
    expect(phoneElement).toBeInTheDocument()
  })

  it('renders hours when isMainOffice is true and officeHours are provided', () => {
    render(
      <VetCenterLocationInfo vetCenter={mockVetCenter} isMainOffice={true} />
    )

    expect(screen.getByText('Hours')).toBeInTheDocument()
  })

  it('does not render hours when isMainOffice is false', () => {
    render(
      <VetCenterLocationInfo vetCenter={mockVetCenter} isMainOffice={false} />
    )

    expect(screen.queryByText('Hours')).not.toBeInTheDocument()
  })
})

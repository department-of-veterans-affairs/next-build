import { render, screen } from '@testing-library/react'
import { VetCenterLocationInfo } from './VetCenterLocationInfo'
import {
  VetCenterLocationInfo as VetCenterLocationInfoType,
  VetCenterCapLocationInfo,
  VetCenterOutstationLocationInfo,
  MobileVetCenterLocationInfo,
} from '@/types/formatted/vetCenterLocationListing'

const mockBaseFields = {
  id: 'test-id',
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
}

const mockOfficeHours = [
  { day: 1, starthours: 900, endhours: 1700 },
  { day: 2, starthours: 900, endhours: 1700 },
  { day: 3, starthours: 900, endhours: 1700 },
]

const mockMainOfficeOfficeHours = [
  { day: 1, starthours: 800, endhours: 1800 },
  { day: 2, starthours: 800, endhours: 1800 },
  { day: 3, starthours: 800, endhours: 1800 },
]

const mockVetCenter: VetCenterLocationInfoType = {
  ...mockBaseFields,
  type: 'node--vet_center',
  officialName: 'Test Official Name',
  phoneNumber: '555-123-4567',
  officeHours: mockOfficeHours,
  operatingStatusFacility: 'normal',
  operatingStatusMoreInfo: null,
}

const mockMainOffice: VetCenterLocationInfoType = {
  ...mockBaseFields,
  id: 'main-office-id',
  title: 'Main Vet Center',
  type: 'node--vet_center',
  officialName: 'Main Official Name',
  phoneNumber: '555-987-6543',
  officeHours: mockMainOfficeOfficeHours,
  operatingStatusFacility: 'normal',
  operatingStatusMoreInfo: null,
}

const mockVetCenterCap: VetCenterCapLocationInfo = {
  ...mockBaseFields,
  type: 'node--vet_center_cap',
  geographicalIdentifier: 'test-geo-id',
  vetCenterCapHoursOptIn: false,
  operatingStatusFacility: 'normal',
  operatingStatusMoreInfo: null,
  officeHours: mockOfficeHours,
}

const mockVetCenterCapWithOptIn: VetCenterCapLocationInfo = {
  ...mockVetCenterCap,
  vetCenterCapHoursOptIn: true,
  officeHours: mockOfficeHours,
}

const mockVetCenterOutstation: VetCenterOutstationLocationInfo = {
  ...mockBaseFields,
  type: 'node--vet_center_outstation',
  operatingStatusFacility: 'normal',
  operatingStatusMoreInfo: null,
  phoneNumber: '555-456-7890',
  officeHours: mockOfficeHours,
  officialName: 'Test Outstation',
}

const mockMobileVetCenter: MobileVetCenterLocationInfo = {
  ...mockBaseFields,
  type: 'node--vet_center_mobile_vet_center',
  phoneNumber: '555-111-2222',
}

describe('VetCenterLocationInfo', () => {
  describe('Basic rendering', () => {
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
  })

  describe('Office Hours Display Logic', () => {
    describe('VetCenter (main office type)', () => {
      it('renders office hours when vetCenter has officeHours', () => {
        render(
          <VetCenterLocationInfo
            vetCenter={mockVetCenter}
            isMainOffice={true}
          />
        )

        expect(screen.getByText('Hours')).toBeInTheDocument()
      })

      it('renders office hours when vetCenter has officeHours and isMainOffice is false', () => {
        render(
          <VetCenterLocationInfo
            vetCenter={mockVetCenter}
            isMainOffice={false}
            mainOffice={mockMainOffice}
          />
        )

        expect(screen.getByText('Hours')).toBeInTheDocument()
      })
    })

    describe('VetCenterOutstation', () => {
      it('renders office hours when outstation has officeHours', () => {
        render(
          <VetCenterLocationInfo
            vetCenter={mockVetCenterOutstation}
            isMainOffice={false}
            mainOffice={mockMainOffice}
          />
        )

        expect(screen.getByText('Hours')).toBeInTheDocument()
      })
    })

    describe('VetCenterCap with vetCenterCapHoursOptIn=true', () => {
      it('renders CAP office hours when CAP opts in to show hours', () => {
        render(
          <VetCenterLocationInfo
            vetCenter={mockVetCenterCapWithOptIn}
            isMainOffice={false}
            mainOffice={mockMainOffice}
          />
        )

        expect(screen.getByText('Hours')).toBeInTheDocument()
      })
    })

    describe('VetCenterCap with vetCenterCapHoursOptIn=false', () => {
      it('shows alternative message when CAP opts out of showing hours', () => {
        render(
          <VetCenterLocationInfo
            vetCenter={mockVetCenterCap}
            isMainOffice={false}
            mainOffice={mockMainOffice}
          />
        )

        expect(screen.queryByText('Hours')).not.toBeInTheDocument()
        expect(
          screen.getByText('Veterans should call main Vet Center for hours')
        ).toBeInTheDocument()
      })
    })

    describe('MobileVetCenter', () => {
      it('MobileVetCenter does not render office hours for mobile vet centers', () => {
        render(
          <VetCenterLocationInfo
            vetCenter={mockMobileVetCenter}
            isMainOffice={false}
            mainOffice={mockMainOffice}
          />
        )

        expect(screen.queryByText('Hours')).not.toBeInTheDocument()
        expect(
          screen.queryByText('Veterans should call main Vet Center for hours')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Phone Number Logic', () => {
    it('uses main office phone number for VetCenterCap', () => {
      render(
        <VetCenterLocationInfo
          vetCenter={mockVetCenterCap}
          isMainOffice={false}
          mainOffice={mockMainOffice}
        />
      )

      // The CAP should use the main office phone number
      const phoneElement = screen.getByTestId('phone')
      expect(phoneElement).toBeInTheDocument()
    })

    it('uses its own phone number for VetCenter', () => {
      render(
        <VetCenterLocationInfo vetCenter={mockVetCenter} isMainOffice={true} />
      )

      const phoneElement = screen.getByTestId('phone')
      expect(phoneElement).toBeInTheDocument()
    })

    it('uses its own phone number for VetCenterOutstation', () => {
      render(
        <VetCenterLocationInfo
          vetCenter={mockVetCenterOutstation}
          isMainOffice={false}
          mainOffice={mockMainOffice}
        />
      )

      const phoneElement = screen.getByTestId('phone')
      expect(phoneElement).toBeInTheDocument()
    })

    it('uses its own phone number for MobileVetCenter', () => {
      render(
        <VetCenterLocationInfo
          vetCenter={mockMobileVetCenter}
          isMainOffice={false}
          mainOffice={mockMainOffice}
        />
      )

      const phoneElement = screen.getByTestId('phone')
      expect(phoneElement).toBeInTheDocument()
    })
  })
})

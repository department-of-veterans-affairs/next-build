import React from 'react'
import { render, screen } from '@testing-library/react'
import { ServiceAddress } from './ServiceAddress'
import { FieldAddress } from '@/types/drupal/field_type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'

describe('ServiceAddress', () => {
  const mockFacilityAddress: FieldAddress = {
    langcode: 'en',
    country_code: 'US',
    administrative_area: 'CA',
    locality: 'Los Angeles',
    postal_code: '90001',
    address_line1: '123 Main St',
  }

  const mockServiceAddress: FieldAddress = {
    langcode: 'en',
    country_code: 'US',
    administrative_area: 'CA',
    locality: 'San Francisco',
    postal_code: '94101',
    address_line1: '456 Service Rd',
  }

  const mockServiceLocationAddress: ParagraphServiceLocationAddress = {
    id: '1',
    type: 'paragraph--service_location_address',
    field_address: mockServiceAddress,
    field_building_name_number: 'Building 5',
    field_clinic_name: 'Cardiology Clinic',
    field_use_facility_address: false,
    field_wing_floor_or_room_number: 'Room 203',
  }

  it('returns null when no address data exists', () => {
    const { container } = render(
      <ServiceAddress
        serviceLocationAddress={{
          ...mockServiceLocationAddress,
          field_address: null,
          field_clinic_name: '',
          field_building_name_number: '',
          field_wing_floor_or_room_number: '',
        }}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('displays no address when useFacilityAddress is true', () => {
    render(
      <ServiceAddress
        serviceLocationAddress={{
          ...mockServiceLocationAddress,
          field_use_facility_address: true,
        }}
        facilityAddress={mockFacilityAddress}
      />
    )

    expect(screen.getByText('Cardiology Clinic')).toBeInTheDocument()
    // Neither the facility nor the service address should be displayed
    expect(
      screen.queryByText(mockFacilityAddress.address_line1)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(mockServiceAddress.address_line1)
    ).not.toBeInTheDocument()
  })

  it('displays service address when useFacilityAddress is false', () => {
    render(
      <ServiceAddress
        serviceLocationAddress={{
          ...mockServiceLocationAddress,
          field_use_facility_address: false,
        }}
      />
    )

    expect(screen.getByText('Cardiology Clinic')).toBeInTheDocument()
    expect(screen.getByText('456 Service Rd')).toBeInTheDocument()
    expect(screen.getByText('San Francisco, CA 94101')).toBeInTheDocument()
    expect(screen.getByText('Building 5')).toBeInTheDocument()
    expect(screen.getByText('Room 203')).toBeInTheDocument()
  })

  it('displays clinic name without address data', () => {
    render(
      <ServiceAddress
        serviceLocationAddress={{
          ...mockServiceLocationAddress,
          field_address: null,
        }}
      />
    )

    expect(screen.getByText('Cardiology Clinic')).toBeInTheDocument()
    expect(screen.queryByText('123 Main St')).not.toBeInTheDocument()
    expect(screen.queryByText('456 Service Rd')).not.toBeInTheDocument()
  })

  it('displays building and room without clinic name', () => {
    render(
      <ServiceAddress
        serviceLocationAddress={{
          ...mockServiceLocationAddress,
          field_clinic_name: '',
        }}
      />
    )

    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Building 5')).toBeInTheDocument()
    expect(screen.getByText('Room 203')).toBeInTheDocument()
    expect(screen.getByText('456 Service Rd')).toBeInTheDocument()
    expect(screen.getByText('San Francisco, CA 94101')).toBeInTheDocument()
  })

  it('combines different address parts correctly', () => {
    render(
      <ServiceAddress
        serviceLocationAddress={{
          ...mockServiceLocationAddress,
          field_clinic_name: 'Orthopedics Clinic',
          field_building_name_number: 'Tower B',
          field_wing_floor_or_room_number: 'Floor 3, Suite 301',
        }}
      />
    )

    expect(screen.getByText('Orthopedics Clinic')).toBeInTheDocument()
    expect(screen.getByText('456 Service Rd')).toBeInTheDocument()
    expect(screen.getByText('San Francisco, CA 94101')).toBeInTheDocument()
    expect(screen.getByText('Tower B')).toBeInTheDocument()
    expect(screen.getByText('Floor 3, Suite 301')).toBeInTheDocument()
  })
})

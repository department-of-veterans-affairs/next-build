import React from 'react'
import { render, screen } from '@testing-library/react'
import { Address } from './Address'
import { FieldAddress } from '@/types/drupal/field_type'

// Mock the child component
jest.mock('@/templates/common/googleMapsDirections', () => ({
  GoogleMapsDirections: ({
    address,
    location,
  }: {
    address: string[]
    location: string
  }) => (
    <div data-testid="google-maps-directions">
      Directions to {location} at {address.join(', ')}
    </div>
  ),
}))

const baseAddress: FieldAddress = {
  langcode: 'en',
  country_code: 'US',
  address_line1: '123 Main St',
  address_line2: '',
  locality: 'Springfield',
  administrative_area: 'IL',
  postal_code: '62704',
}

describe('<Address />', () => {
  it('renders the address correctly without address_line2', () => {
    const { container } = render(
      <Address address={baseAddress} title="VA Clinic" />
    )

    const addressEl = container.querySelector('address')
    expect(addressEl).toHaveTextContent('123 Main St')
    expect(addressEl).toHaveTextContent('Springfield, IL 62704')
    expect(addressEl).not.toHaveTextContent('address_line2')
  })

  it('renders the address correctly with address_line2', () => {
    const fullAddress = { ...baseAddress, address_line2: 'Suite 100' }

    const { container } = render(
      <Address address={fullAddress} title="VA Clinic" />
    )

    const addressEl = container.querySelector('address')
    expect(addressEl).toHaveTextContent('123 Main St')
    expect(addressEl).toHaveTextContent('Suite 100')
    expect(addressEl).toHaveTextContent('Springfield, IL 62704')
  })

  it('passes correct props to <GoogleMapsDirections />', () => {
    const fullAddress = { ...baseAddress, address_line2: 'Suite 100' }

    render(<Address address={fullAddress} title="VA Clinic" />)

    // Assert our mocked component received the right info
    expect(screen.getByTestId('google-maps-directions')).toHaveTextContent(
      'Directions to VA Clinic at 123 Main St, Springfield, IL'
    )
  })
})

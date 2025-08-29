import React from 'react'
import { render } from '@testing-library/react'
import { Address } from './Address'
import { FieldAddress } from '@/types/drupal/field_type'

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

    const { container } = render(
      <Address address={fullAddress} title="VA Clinic" />
    )
    const link = container.querySelector('va-link')

    expect(link).toHaveAttribute(
      'href',
      'https://maps.google.com/?saddr=Current+Location&daddr=123%20Main%20St%2CSpringfield%2CIL'
    )
    expect(link).toHaveAttribute('text', 'Get directions on Google Maps')
    expect(link).toHaveAttribute(
      'label',
      'Get directions on Google Maps to VA Clinic'
    )
  })
})

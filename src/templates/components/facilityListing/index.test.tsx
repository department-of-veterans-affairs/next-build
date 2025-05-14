import React from 'react'
import { render, screen } from '@testing-library/react'
import { FacilityListing } from './index'
import { MinimalLocalFacility } from '@/types/formatted/vamcSystem'

const mockFacility: MinimalLocalFacility = {
  title: 'Test Facility',
  path: '/test-facility',
  operatingStatusFacility: 'normal',
  address: {
    langcode: 'en',
    country_code: 'US',
    address_line1: '123 Test St',
    address_line2: 'Suite 100',
    locality: 'Test City',
    administrative_area: 'TS',
    postal_code: '12345',
  },
  phoneNumber: '800-555-1234',
  vaHealthConnectPhoneNumber: '800-555-5678',
  fieldTelephone: {
    id: 'test-phone-id',
    type: 'paragraph--phone_number',
    drupal_internal__id: 123,
    drupal_internal__revision_id: 456,
    langcode: 'en',
    status: true,
    created: '2024-01-01T00:00:00+00:00',
    changed: '2024-01-01T00:00:00+00:00',
    field_phone_label: 'Mental health',
    field_phone_number: '800-555-9012',
    field_phone_extension: '',
    field_phone_number_type: 'voice',
  },
  image: {
    id: 'test-image',
    alt: 'Test Facility Image',
    title: 'Test Facility',
    links: {
      '3_2_medium_thumbnail': {
        href: 'https://example.com/test-image.jpg',
      },
    },
  },
}

describe('FacilityListing with valid data', () => {
  test('renders basic facility information', () => {
    const { container } = render(
      <FacilityListing facility={mockFacility} basePath="/test" />
    )

    // Check facility title using va-link
    const titleLink = container.querySelector('va-link[text="Test Facility"]')
    expect(titleLink).toBeInTheDocument()
    expect(titleLink).toHaveAttribute('href', mockFacility.path)

    // Check address
    const expectText = (text: string) =>
      expect(screen.getByText(text, { exact: false })).toBeInTheDocument()
    expectText(mockFacility.address.address_line1)
    expectText(mockFacility.address.locality)
    expectText(mockFacility.address.administrative_area)
    expectText(mockFacility.address.postal_code)

    // Check directions link
    const directionsLink = container.querySelector(
      'va-link[name="maps-directions"]'
    )
    expect(directionsLink).toBeInTheDocument()
    expect(directionsLink).toHaveAttribute(
      'href',
      expect.stringContaining('maps.google.com')
    )
    expect(directionsLink).toHaveAttribute(
      'text',
      'Get directions on Google Maps'
    )
  })

  test('renders phone numbers', () => {
    const { container } = render(
      <FacilityListing facility={mockFacility} basePath="/test" />
    )

    // Check main phone
    expect(screen.getByText('Main phone:')).toBeInTheDocument()
    const mainPhone = container.querySelector(
      `va-telephone[contact="${mockFacility.phoneNumber}"]`
    )
    expect(mainPhone).toBeInTheDocument()

    // Check VA health connect phone
    expect(screen.getByText('VA health connect:')).toBeInTheDocument()
    const healthConnectPhone = container.querySelector(
      `va-telephone[contact="${mockFacility.vaHealthConnectPhoneNumber}"]`
    )
    expect(healthConnectPhone).toBeInTheDocument()

    // Check mental health phone
    expect(screen.getByText('Mental health:')).toBeInTheDocument()
    const mentalHealthPhone = container.querySelector(
      `va-telephone[contact="${mockFacility.fieldTelephone.field_phone_number.replace(/-/g, '')}"]`
    )
    expect(mentalHealthPhone).toBeInTheDocument()
    expect(mentalHealthPhone).toHaveAttribute(
      'message-aria-describedby',
      'Mental health'
    )
  })

  test('renders facility image when available', () => {
    const { container } = render(
      <FacilityListing facility={mockFacility} basePath="/test" />
    )

    // Check the image link
    const imageLink = container.querySelector(
      'a[aria-label="Test Facility Image"]'
    )
    expect(imageLink).toBeInTheDocument()
    expect(imageLink).toHaveAttribute('href', mockFacility.path)

    // Check the image
    const image = screen.getByRole('img', { name: mockFacility.image.alt })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining(
        encodeURIComponent(
          mockFacility.image.links['3_2_medium_thumbnail'].href
        )
      )
    )
    expect(image).toHaveAttribute('alt', mockFacility.image.alt)
  })

  test('does not render operating status flags when status is normal', () => {
    const { container } = render(
      <FacilityListing facility={mockFacility} basePath="/test" />
    )
    expect(container.querySelector('va-alert')).not.toBeInTheDocument()
  })

  test('renders operating status flags when status is not normal', () => {
    const facilityWithNotice = {
      ...mockFacility,
      operatingStatusFacility: 'notice',
    }
    const { container } = render(
      <FacilityListing facility={facilityWithNotice} basePath="/test" />
    )
    const alert = container.querySelector('va-alert')
    expect(alert).toBeInTheDocument()
    const link = alert.querySelector('va-link')
    expect(link).toHaveAttribute('text', 'Facility notice')
  })

  test('does not render address in mobile view', () => {
    const { container } = render(
      <FacilityListing facility={mockFacility} basePath="/test" type="mobile" />
    )
    expect(container.querySelector('address')).not.toBeInTheDocument()
  })

  test('does not render image when image data is incomplete', () => {
    const facilityWithoutImage = {
      ...mockFacility,
      image: {
        ...mockFacility.image,
        alt: '', // Missing alt text
      },
    }
    const { container } = render(
      <FacilityListing facility={facilityWithoutImage} basePath="/test" />
    )
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})

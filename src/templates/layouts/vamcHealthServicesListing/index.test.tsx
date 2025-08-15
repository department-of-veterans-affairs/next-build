import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcHealthServicesListing } from './index'

describe('VamcHealthServicesListing with valid data', () => {
  test('renders VamcHealthServicesListing component', () => {
    render(
      <VamcHealthServicesListing
        title={'Health services'}
        introText={'Test intro'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('Health services')).toBeInTheDocument()
  })

  test('renders intro text when provided', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('This is intro text')).toBeInTheDocument()
  })

  test('renders Top Task links when path is provided', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/boston-health-care/health-services'}
        administration={null}
        vamcEhrSystem={null}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    // Check that the Top Task links are visible using the same approach as locationsListing
    const makeAppointmentLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'Make an appointment'
    )
    const healthServicesLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'View all health services'
    )
    const registerLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'Register for care'
    )

    expect(makeAppointmentLink).toBeInTheDocument()
    expect(healthServicesLink).toBeInTheDocument()
    expect(registerLink).toBeInTheDocument()
  })

  test('renders section headings correctly', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('In the spotlight')).toBeInTheDocument()
    expect(screen.getByText('Primary care')).toBeInTheDocument()
    expect(screen.getByText('Mental health care')).toBeInTheDocument()
    expect(screen.getByText('Specialty care')).toBeInTheDocument()
    expect(screen.getByText('Social programs and services')).toBeInTheDocument()
    expect(screen.getByText('Other services')).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcHealthServicesListing } from './template'

describe('VamcHealthServicesListing with valid data', () => {
  test('renders VamcHealthServicesListing component', () => {
    render(
      <VamcHealthServicesListing
        title={'Health services'}
        introText={'Test intro'}
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
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('This is intro text')).toBeInTheDocument()
  })

  test('renders section headings correctly', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
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

  test('renders lovell switcher when lovell props are provided', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
        lovellVariant={'va'}
        lovellSwitchPath={'/lovell-facility/health-services'}
      />
    )
    expect(
      screen.getByText('You are viewing this page as a VA beneficiary.')
    ).toBeInTheDocument()
  })
})

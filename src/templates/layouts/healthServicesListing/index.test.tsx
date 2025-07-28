import React from 'react'
import { render, screen } from '@testing-library/react'
import { HealthServicesListing } from './index'

describe('HealthServicesListing with valid data', () => {
  test('renders HealthServicesListing component', () => {
    render(
      <HealthServicesListing
        title={'Health services'}
        description={'Test description'}
        introText={'Test intro'}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('Health services')).toBeInTheDocument()
  })

  test('renders description and intro text when provided', () => {
    render(
      <HealthServicesListing
        title={'Health Services'}
        description={'This is a test description'}
        introText={'This is intro text'}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('This is a test description')).toBeInTheDocument()
    expect(screen.getByText('This is intro text')).toBeInTheDocument()
  })
})

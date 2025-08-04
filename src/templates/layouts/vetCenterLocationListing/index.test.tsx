import React from 'react'
import { render, screen } from '@testing-library/react'
import { VetCenterLocationListing } from './index'
import { formatter } from '@/data/queries/vetCenterLocationListing'
import drupalMockData from '@/mocks/vetCenterLocationListing.mock.json'

const mockData = formatter(drupalMockData)

describe('VetCenterLocationListing with valid data', () => {
  test('renders VetCenterLocationListing component', () => {
    render(<VetCenterLocationListing {...mockData} />)

    expect(screen.queryByText(/Locations/)).toBeInTheDocument()
  })
})

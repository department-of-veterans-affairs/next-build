import React from 'react'
import { render, screen } from '@testing-library/react'
import { VetCenterLocationListing } from './index'
import { formatter } from '@/data/queries/vetCenterLocationListing'
import drupalMockData from '@/mocks/vetCenterLocationListing.mock.json'
import mockCap from '@/mocks/vetCenterCap.mock.json'
import mockOutstation from '@/mocks/vetCenterOutstation.mock.json'
import { NodeVetCenterCap } from '@/types/drupal/node'
import { NodeVetCenterOutstation } from '@/types/drupal/node'

// Restructure mock data to match expected format
const mockData = formatter({
  entity: drupalMockData,
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  caps: [mockCap as NodeVetCenterCap],
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  outstations: [mockOutstation as NodeVetCenterOutstation],
  mobileVetCenters: [],
})

describe('VetCenterLocationListing with valid data', () => {
  test('renders VetCenterLocationListing component', () => {
    render(<VetCenterLocationListing {...mockData} />)

    expect(screen.queryByText(/Locations/)).toBeInTheDocument()
  })
})

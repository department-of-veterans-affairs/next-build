import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import VetCenterHealthServices from '.'

const mockServices = [
  {
    name: 'Service 1',
    vetCenterTypeOfCare: null,
    vetCenterFriendlyName: null,
    alsoKnownAs: null,
    vetCenterComConditions: null,
    commonlyTreatedCondition: null,
    vetCenterServiceDescription: null,
    description: null,
    body: '<p>Service 1 Description</p>',
  },
]

describe('VetCenterHealthServices Component', () => {
  it('renders correctly with typeOfCare as counseling', () => {
    render(
      <VetCenterHealthServices
        services={mockServices}
        typeOfCare="counseling"
      />
    )
    expect(screen.getByText('Counseling services')).toBeInTheDocument()
    expect(
      screen.getByText('Select a topic to learn more.')
    ).toBeInTheDocument()
  })

  it('renders correctly with typeOfCare as referral', () => {
    render(
      <VetCenterHealthServices services={mockServices} typeOfCare="referral" />
    )
    expect(screen.getByText('Referral services')).toBeInTheDocument()
  })

  it('renders the default heading when typeOfCare is not recognized', () => {
    render(
      <VetCenterHealthServices services={mockServices} typeOfCare="unknown" />
    )
    expect(screen.getByText('Other services')).toBeInTheDocument()
  })

  it('renders nothing when services array is empty', () => {
    render(<VetCenterHealthServices services={[]} typeOfCare="counseling" />)
    expect(screen.queryByText('Counseling services')).toBeNull()
  })
})

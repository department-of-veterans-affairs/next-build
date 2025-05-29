import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HealthServices from '.'

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

describe('HealthServices Component', () => {
  it('renders correctly with typeOfCare as counseling', () => {
    render(<HealthServices services={mockServices} typeOfCare="counseling" />)
    expect(screen.getByText('Counseling Services')).toBeInTheDocument()
    expect(
      screen.getByText('Click on a service for more details.')
    ).toBeInTheDocument()
  })

  it('renders correctly with typeOfCare as referral', () => {
    render(<HealthServices services={mockServices} typeOfCare="referral" />)
    expect(screen.getByText('Referral Services')).toBeInTheDocument()
  })

  it('renders the default heading when typeOfCare is not recognized', () => {
    render(<HealthServices services={mockServices} typeOfCare="unknown" />)
    expect(screen.getByText('Other Services')).toBeInTheDocument()
  })

  it('renders nothing when services array is empty', () => {
    render(<HealthServices services={[]} typeOfCare="counseling" />)
    expect(screen.queryByText('Counseling Services')).toBeNull()
  })
})

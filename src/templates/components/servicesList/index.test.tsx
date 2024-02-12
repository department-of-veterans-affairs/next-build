import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import ServicesList from '.'

const mockServices = [
  {
    name: 'Service 1',
    vetCenterFriendlyName: 'Friendly Name 1',
    vetCenterComConditions: 'Condition 1',
    vetCenterServiceDescription: 'Description 1',
    body: '<p>Body 1</p>',
    vetCenterTypeOfCare: null,
    alsoKnownAs: null,
    description: null,
    commonlyTreatedCondition: null,
  },
  {
    name: 'Service 2',
    vetCenterFriendlyName: 'Friendly Name 2',
    vetCenterComConditions: 'Condition 2',
    vetCenterServiceDescription: 'Description 2',
    body: '<p>Body 2</p>',
    vetCenterTypeOfCare: null,
    alsoKnownAs: null,
    description: null,
    commonlyTreatedCondition: null,
  },
]

describe('<ServicesList> Component', () => {
  it('renders correctly with services data', () => {
    render(<ServicesList services={mockServices} />)
    const firstService = document.getElementById('item-service-1')
    const secondService = document.getElementById('item-service-2')

    expect(firstService).toBeTruthy()
    expect(secondService).toBeTruthy()
  })

  it('renders no items when passed an empty array', () => {
    render(<ServicesList services={[]} />)
    const firstService = document.getElementById('item-service-1')
    const secondService = document.getElementById('item-service-2')

    expect(firstService).toBeFalsy()
    expect(secondService).toBeFalsy()
  })
})

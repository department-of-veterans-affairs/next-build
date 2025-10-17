import React from 'react'
import { render, screen } from '@testing-library/react'
import { CampaignLandingPage } from './template'


describe('CampaignLandingPage with valid data', () => {
  test('renders CampaignLandingPage component', () => {
    render(<CampaignLandingPage title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcOperatingStatusAndAlerts } from './template'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  test('renders VamcOperatingStatusAndAlerts component', () => {
    render(<VamcOperatingStatusAndAlerts facilityName={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

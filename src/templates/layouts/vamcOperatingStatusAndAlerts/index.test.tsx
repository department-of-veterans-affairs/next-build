import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcOperatingStatusAndAlerts } from './index'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  test('renders VamcOperatingStatusAndAlerts component', () => {
    render(<VamcOperatingStatusAndAlerts title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

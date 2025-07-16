import React from 'react'
import { render, screen } from '@testing-library/react'
import { VbaFacility } from './index'


describe('VbaFacility with valid data', () => {
  test('renders VbaFacility component', () => {
    render(<VbaFacility title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

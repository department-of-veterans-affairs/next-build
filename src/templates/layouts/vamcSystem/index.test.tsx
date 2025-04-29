import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystem } from './index'


describe('VamcSystem with valid data', () => {
  test('renders VamcSystem component', () => {
    render(<VamcSystem title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

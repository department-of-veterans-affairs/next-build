import React from 'react'
import { render, screen } from '@testing-library/react'
import { VaForm } from './template'


describe('VaForm with valid data', () => {
  test('renders VaForm component', () => {
    render(<VaForm title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

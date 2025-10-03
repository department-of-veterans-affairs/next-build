import React from 'react'
import { render, screen } from '@testing-library/react'
import { BenefitsHub } from './template'

describe('BenefitsHub with valid data', () => {
  test('renders BenefitsHub component', () => {
    render(<BenefitsHub title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

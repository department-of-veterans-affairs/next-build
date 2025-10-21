import React from 'react'
import { render, screen } from '@testing-library/react'
import { BenefitsDetailPage } from './template'


describe('BenefitsDetailPage with valid data', () => {
  test('renders BenefitsDetailPage component', () => {
    render(<BenefitsDetailPage title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BenefitsHub } from './template'

describe('BenefitsHub with valid data', () => {
  test('renders BenefitsHub component', () => {
    render(
      <BenefitsHub
        id="1"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Hello world'}
        titleIcon={null}
      />
    )

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

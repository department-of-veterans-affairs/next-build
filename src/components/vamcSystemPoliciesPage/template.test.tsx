import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystemPoliciesPage } from './template'


describe('VamcSystemPoliciesPage with valid data', () => {
  test('renders VamcSystemPoliciesPage component', () => {
    render(<VamcSystemPoliciesPage title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

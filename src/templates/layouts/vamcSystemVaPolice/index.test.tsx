import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystemVaPolice } from './index'


describe('VamcSystemVaPolice with valid data', () => {
  test('renders VamcSystemVaPolice component', () => {
    render(<VamcSystemVaPolice title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

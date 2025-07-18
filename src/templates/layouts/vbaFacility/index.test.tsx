import React from 'react'
import { render, screen } from '@testing-library/react'
import { VbaFacility } from './index'

describe('VbaFacility with valid data', () => {
  test('renders VbaFacility component', () => {
    render(
      <VbaFacility
        id="test-id"
        type="test-type"
        published={true}
        lastUpdated={new Date().toISOString()}
        title={'Hello world'}
      />
    )

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

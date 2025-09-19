import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcOperatingStatusAndAlerts } from './template'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  test('renders VamcOperatingStatusAndAlerts component', () => {
    render(
      <VamcOperatingStatusAndAlerts
        id="111"
        type="node"
        published={true}
        title="title"
        lastUpdated="2025-02-27T17:26:37+00:00"
        situationUpdates={null}
        facilityName={'Hello world'}
      />
    )

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcOperatingStatusAndAlerts } from './template'
import mockData from './mock.json'
import { formatter } from './query'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  const vamcOperatingStatusAndAlertsData = formatter({
    entity: mockData,
    menu: null,
  })
  test('renders VamcOperatingStatusAndAlerts component', () => {
    render(
      <VamcOperatingStatusAndAlerts {...vamcOperatingStatusAndAlertsData} />
    )
    expect(
      screen.queryByText(/VA Oklahoma City health care/)
    ).toBeInTheDocument()
  })
})

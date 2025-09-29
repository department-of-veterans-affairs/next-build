import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcOperatingStatusAndAlerts } from './template'
import mockData from './mock.json'
import { formatter } from './query'
import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  const vamcOperatingStatusAndAlertsData = formatter({
    entity: mockData as NodeVamcOperatingStatusAndAlerts,
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

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
  test('renders situation updates', () => {
    render(
      <VamcOperatingStatusAndAlerts {...vamcOperatingStatusAndAlertsData} />
    )
    expect(screen.getByTestId('situation-updates-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('situation-update-1-date')).toHaveTextContent(
      'Friday, Sep 19, 2:41 p.m. PDT'
    )
    expect(screen.getByTestId('situation-update-1-update')).toHaveTextContent(
      'A new update'
    )
    expect(screen.getByTestId('situation-update-1-info')).toContainHTML(
      '<p>this is info</p>'
    )
  })
})

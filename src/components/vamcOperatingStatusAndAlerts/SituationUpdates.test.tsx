import React from 'react'
import { render, screen } from '@testing-library/react'
import { SituationUpdates } from './SituationUpdates'
import mockData from './mock.json'
import { formatter } from './query'

describe('SituationUpdates', () => {
  const vamcOperatingStatusAndAlertsData = formatter({
    entity: mockData,
    menu: null,
  })
  test('renders situation updates', () => {
    render(
      <SituationUpdates
        situationUpdates={vamcOperatingStatusAndAlertsData.situationUpdates}
      />
    )
    expect(screen.getByTestId('situation-updates-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('situation-1-update-1-date')).toHaveTextContent(
      'Friday, Sep 19, 2:41 p.m. PT'
    )
    expect(screen.getByTestId('situation-1-update-1-update')).toHaveTextContent(
      'A new update'
    )
    expect(screen.getByTestId('situation-1-info')).toContainHTML(
      '<p>this is info</p>'
    )
  })
})

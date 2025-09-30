import React from 'react'
import { render, screen } from '@testing-library/react'
import { SituationUpdates } from './SituationUpdates'

describe('SituationUpdates', () => {
  const situationUpdateData = [
    {
      updates: [
        {
          dateTime: '2025-09-19T21:41:00+00:00',
          timezone: 'America/Los_Angeles',
          updateText: '<p>A new update</p>',
        },
      ],
      info: '<p>this is info</p>',
    },
  ]

  test('renders situation updates', () => {
    render(<SituationUpdates situationUpdates={situationUpdateData} />)
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

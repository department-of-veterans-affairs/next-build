import React from 'react'
import { render, screen } from '@testing-library/react'
import { VbaFacility } from './index'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'

describe('VbaFacility with valid data', () => {
  test('renders VbaFacility component', () => {
    render(
      <VbaFacility
        id="test-id"
        type="test-type"
        published={true}
        lastUpdated={new Date().toISOString()}
        title={'Hello world'}
        ccVBAFacilityOverview={{
          id: '1',
          type: 'paragraph--wysiwyg' as FormattedWysiwyg['type'],
          html: '<p>We help Veterans, service members, and their families access VA benefits and services. Benefits we can help with include disability compensation, education benefits, life insurance, pensions, and home loans.</p>',
        }}
      />
    )

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

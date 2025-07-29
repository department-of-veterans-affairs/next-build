import React from 'react'
import { render, screen } from '@testing-library/react'
import { VbaFacility } from './index'
import mockData from '@/mocks/vbaFacility.mock.json'
import { formatter } from '@/data/queries/vbaFacility'

describe('VbaFacility with valid data', () => {
  const formattedMockData = formatter(mockData)
  test('renders VbaFacility component', () => {
    render(<VbaFacility {...formattedMockData} />)

    expect(
      screen.queryByText(
        /Veteran Readiness and Employment Office at West Palm Beach VA Medical Center/
      )
    ).toBeInTheDocument()
  })
})

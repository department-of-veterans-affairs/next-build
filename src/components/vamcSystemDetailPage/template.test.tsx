import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemDetailPage from './template'
import mockData from './mock.json'
import { formatter } from './query'

describe('VamcSystemDetailPage', () => {
  const formattedMockData = formatter(mockData as any)

  it('renders the title', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('renders intro text when provided', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(screen.getByText('Explore VA Bronx\'s research initiatives with specialty programs in [List research here] . You can also volunteer to participate in a research study.')).toBeInTheDocument()
  })
})

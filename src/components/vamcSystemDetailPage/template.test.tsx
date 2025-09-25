import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemDetailPage from './template'
import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import { Menu } from '@/types/drupal/menu'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'
import { formatter } from './query'

describe('VamcSystemDetailPage', () => {
  const formattedMockData = formatter({
    entity: mockPage as NodeVamcSystemDetailPage,
    menu: mockMenu as unknown as Menu,
    lovell: null,
  })

  it('renders the title', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('renders intro text when provided', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(
      screen.getByText(
        "Explore VA Bronx's research initiatives with specialty programs in [List research here] . You can also volunteer to participate in a research study."
      )
    ).toBeInTheDocument()
  })
})

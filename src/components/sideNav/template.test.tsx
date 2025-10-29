import React from 'react'
import { render, screen } from '@testing-library/react'
import { SideNav } from './template'
import { SideNavMenu } from '@/types/formatted/sideNav'

const mockMenu: SideNavMenu = {
  rootPath: '/health-care',
  data: {
    name: 'Health Care',
    description: 'Health care navigation',
    links: [
      {
        description: 'Get health care',
        expanded: false,
        label: 'Get health care',
        links: [],
        url: { path: '/health-care/get-health-care' },
      },
      {
        description: 'Manage your health',
        expanded: false,
        label: 'Manage your health',
        links: [],
        url: { path: '/health-care/manage-your-health' },
      },
    ],
  },
}

describe('SideNav', () => {
  beforeEach(() => {
    // Reset window.sideNav before each test
    ;(window as { sideNav?: SideNavMenu }).sideNav = undefined
  })

  test('renders side nav widget element with correct attributes', () => {
    render(<SideNav menu={mockMenu} />)

    const sideNavElement = screen.getByRole('navigation', { name: 'secondary' })
    expect(sideNavElement).toBeInTheDocument()
    expect(sideNavElement).toHaveAttribute('data-widget-type', 'side-nav')
  })

  test('sets window.sideNav when component mounts', () => {
    render(<SideNav menu={mockMenu} />)

    expect(window.sideNav).toEqual(mockMenu)
  })

  test('updates window.sideNav when menu prop changes', () => {
    const { rerender } = render(<SideNav menu={mockMenu} />)

    expect(window.sideNav).toEqual(mockMenu)

    const newMenu: SideNavMenu = {
      rootPath: '/benefits',
      data: {
        name: 'Benefits',
        description: 'Benefits navigation',
        links: [
          {
            description: 'Get benefits',
            expanded: false,
            label: 'Get benefits',
            links: [],
            url: { path: '/benefits/get-benefits' },
          },
        ],
      },
    }

    rerender(<SideNav menu={newMenu} />)

    expect(window.sideNav).toEqual(newMenu)
  })
})

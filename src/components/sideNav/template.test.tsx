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
  describe('when useWidget is true', () => {
    beforeEach(() => {
      // Reset window.sideNav before each test
      ;(window as { sideNav?: SideNavMenu }).sideNav = undefined
    })

    test('renders WidgetSideNav component', () => {
      render(<SideNav menu={mockMenu} useWidget={true} />)

      const sideNavElement = screen.getByRole('navigation', {
        name: 'secondary',
      })
      expect(sideNavElement).toBeInTheDocument()
      expect(sideNavElement).toHaveAttribute('data-widget-type', 'side-nav')
    })

    test('sets window.sideNav when component mounts', () => {
      render(<SideNav menu={mockMenu} useWidget={true} />)

      expect(window.sideNav).toEqual(mockMenu)
    })
  })

  describe('when useWidget is false', () => {
    test('renders WebComponentSideNav component', () => {
      const { container } = render(
        <SideNav menu={mockMenu} useWidget={false} />
      )

      expect(
        container.querySelector(
          'va-sidenav-item[href="/health-care/get-health-care"]'
        )
      ).toBeInTheDocument()
      expect(
        container.querySelector(
          'va-sidenav-item[href="/health-care/manage-your-health"]'
        )
      ).toBeInTheDocument()
    })
  })
})

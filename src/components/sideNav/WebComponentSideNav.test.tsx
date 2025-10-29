import React from 'react'
import { render, screen } from '@testing-library/react'
import { WebComponentSideNav } from './WebComponentSideNav'
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

const mockIcon = { name: 'person', backgroundColor: '#0071BB' }

describe('WebComponentSideNav', () => {
  test('renders side nav element', () => {
    const { container } = render(
      <WebComponentSideNav menu={mockMenu} icon={mockIcon} />
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

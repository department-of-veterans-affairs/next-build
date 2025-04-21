import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import StaffProfileSideBarNav from '@/templates/components/staffProfileSideBarNav'
import { recordEvent } from '@/lib/analytics/recordEvent'

jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

describe('SidebarNav', () => {
  const mockSidebarData = {
    link: {
      label: 'Donald Koenig',
      url: { path: '/' },
    },
    parent: {
      label: 'Leadership',
      links: [],
      url: { path: '/pittsburgh-health-care/leadership' },
    },
  }

  const mockLovellSidebarData = {
    link: {
      label: 'Donald Koenig',
      url: { path: '/' },
    },
    parent: {
      label: 'Leadership',
      links: [],
      url: { path: '/lovell-federal-health-care/leadership' },
    },
  }
  it('renders the sidebar navigation with the correct structure', () => {
    render(
      <StaffProfileSideBarNav
        sidebarData={mockSidebarData}
        lovellVariant={undefined}
      />
    )
    const leaderShipLink = screen.getByTestId('sidebar-nav-link')
    expect(screen.getByText('Donald Koenig')).toBeInTheDocument()
    expect(leaderShipLink).toHaveAttribute(
      'href',
      '/pittsburgh-health-care/leadership'
    )
  })
  it('renders the sidebar navigation with the correct Lovell VA structure', () => {
    render(
      <StaffProfileSideBarNav
        sidebarData={mockLovellSidebarData}
        lovellVariant="va"
      />
    )
    const leaderShipLink = screen.getByTestId('sidebar-nav-link')
    expect(screen.getByText('Donald Koenig')).toBeInTheDocument()
    expect(leaderShipLink).toHaveAttribute(
      'href',
      '/lovell-federal-health-care-va/leadership'
    )
  })
  it('renders the sidebar navigation with the correct Lovell Tricare structure', () => {
    render(
      <StaffProfileSideBarNav
        sidebarData={mockLovellSidebarData}
        lovellVariant="tricare"
      />
    )
    const leaderShipLink = screen.getByTestId('sidebar-nav-link')
    expect(screen.getByText('Donald Koenig')).toBeInTheDocument()
    expect(leaderShipLink).toHaveAttribute(
      'href',
      '/lovell-federal-health-care-tricare/leadership'
    )
  })
})

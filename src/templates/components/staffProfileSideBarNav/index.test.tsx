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
      links: [{ label: 'Donald Koenig second link', url: { path: '/' } }],
    },
    parent: {
      label: 'Leadership',
      links: [],
      url: { path: '/pittsburgh-health-care/leadership' },
    },
  }

  it('renders the sidebar navigation with the correct structure', () => {
    render(
      <StaffProfileSideBarNav sidebarData={mockSidebarData} entityUrlPath="/" />
    )

    expect(screen.getByText('Donald Koenig')).toBeInTheDocument()
    expect(screen.getByText('Leadership')).toBeInTheDocument()
  })

  it('applies active class to the correct link', () => {
    render(
      <StaffProfileSideBarNav sidebarData={mockSidebarData} entityUrlPath="/" />
    )

    const activeLink = screen.getByText('Donald Koenig second link')
    expect(activeLink).toHaveClass('usa-current')
  })

  it('calls recordEvent when the link is clicked', () => {
    render(
      <StaffProfileSideBarNav sidebarData={mockSidebarData} entityUrlPath="/" />
    )

    const link = screen.getByText('Donald Koenig second link')
    fireEvent.click(link)

    expect(recordEvent).toHaveBeenCalledWith({ event: 'nav-sidenav' })
  })
})

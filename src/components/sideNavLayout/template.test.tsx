import React from 'react'
import { render, screen } from '@testing-library/react'
import { SideNavLayout } from './template'
import { SideNavMenu } from '@/types/formatted/sideNav'

// Mock window object
const mockWindow = {
  sideNav: undefined,
}

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

describe('SideNavLayout', () => {
  beforeEach(() => {
    // Reset window.sideNav before each test
    mockWindow.sideNav = undefined
  })

  test('renders SideNavLayout component with children', () => {
    render(
      <SideNavLayout menu={mockMenu}>
        <div data-testid="test-content">Test content</div>
      </SideNavLayout>
    )

    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  test('renders with correct CSS classes', () => {
    const { container } = render(
      <SideNavLayout menu={mockMenu}>
        <div>Test content</div>
      </SideNavLayout>
    )

    const gridContainer = container.querySelector('.vads-grid-container')
    const gridRow = container.querySelector('.vads-grid-row')
    const gridCol = container.querySelector('.vads-grid-col-12')

    expect(gridContainer).toBeInTheDocument()
    expect(gridRow).toBeInTheDocument()
    expect(gridCol).toBeInTheDocument()
  })

  test('renders side nav widget element with correct attributes', () => {
    render(
      <SideNavLayout menu={mockMenu}>
        <div>Test content</div>
      </SideNavLayout>
    )

    const sideNavElement = screen.getByRole('navigation', { name: 'secondary' })
    expect(sideNavElement).toBeInTheDocument()
    expect(sideNavElement).toHaveAttribute('data-widget-type', 'side-nav')
  })

  test('applies custom className when provided', () => {
    const customClass = 'custom-side-nav-layout'
    const { container } = render(
      <SideNavLayout menu={mockMenu} className={customClass}>
        <div>Test content</div>
      </SideNavLayout>
    )

    const gridContainer = container.querySelector('.vads-grid-container')
    expect(gridContainer).toHaveClass(customClass)
  })

  test('passes through additional props to the container div', () => {
    const { container } = render(
      <SideNavLayout menu={mockMenu} data-testid="side-nav-layout" id="test-id">
        <div>Test content</div>
      </SideNavLayout>
    )

    const gridContainer = container.querySelector('.vads-grid-container')
    expect(gridContainer).toHaveAttribute('data-testid', 'side-nav-layout')
    expect(gridContainer).toHaveAttribute('id', 'test-id')
  })

  test('sets window.sideNav when component mounts', () => {
    render(
      <SideNavLayout menu={mockMenu}>
        <div>Test content</div>
      </SideNavLayout>
    )

    expect(window.sideNav).toEqual(mockMenu)
  })

  test('updates window.sideNav when menu prop changes', () => {
    const { rerender } = render(
      <SideNavLayout menu={mockMenu}>
        <div>Test content</div>
      </SideNavLayout>
    )

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

    rerender(
      <SideNavLayout menu={newMenu}>
        <div>Test content</div>
      </SideNavLayout>
    )

    expect(window.sideNav).toEqual(newMenu)
  })

  test('renders multiple children correctly', () => {
    render(
      <SideNavLayout menu={mockMenu}>
        <div data-testid="child-1">First child</div>
        <div data-testid="child-2">Second child</div>
        <span data-testid="child-3">Third child</span>
      </SideNavLayout>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })
})

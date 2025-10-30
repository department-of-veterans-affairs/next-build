import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CustomSideNav } from './CustomSideNav'
import { SideNavMenu, SideNavItem } from '@/types/formatted/sideNav'
import { SideNavMenuIcon } from './formatted-type'

// Mock Next.js navigation
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock analytics
const mockRecordEvent = jest.fn()
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: (...args: unknown[]) => mockRecordEvent(...args),
}))

describe('CustomSideNav', () => {
  // Helper to create a nav item
  const createNavItem = (
    label: string,
    path: string,
    children: SideNavItem[] = []
  ): SideNavItem => ({
    label,
    description: null,
    expanded: false,
    url: { path },
    links: children,
    lovellSection: null,
  })

  // Helper to create a basic menu
  const createMenu = (links: SideNavItem[]): SideNavMenu => ({
    rootPath: '/test',
    data: {
      name: 'Test Menu',
      description: null,
      links: [
        {
          label: 'Main Section',
          description: null,
          expanded: false,
          url: { path: '/main' },
          links,
          lovellSection: null,
        },
      ],
    },
  })

  const basicIcon: SideNavMenuIcon = {
    name: 'home',
    backgroundColor: 'blue',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/test/path')
  })

  describe('Basic Rendering', () => {
    it('renders the sidebar with correct attributes', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])
      mockUsePathname.mockReturnValue('/test/item1')

      const { container } = render(<CustomSideNav menu={menu} />)

      const nav = container.querySelector('#va-detailpage-sidebar')
      expect(nav).toHaveAttribute('id', 'va-detailpage-sidebar')
      expect(nav).toHaveAttribute('data-template', 'navigation/sidebar_nav')
      expect(nav).toHaveAttribute('data-drupal-sidebar', 'true')
    })

    it('renders the close button', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      render(<CustomSideNav menu={menu} />)

      const closeButton = screen.getByRole('button', {
        name: /close this menu/i,
      })
      expect(closeButton).toBeInTheDocument()
    })

    it('renders the menu title', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      render(<CustomSideNav menu={menu} />)

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Main Section'
      )
    })

    it('renders with an icon when provided', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      const { container } = render(
        <CustomSideNav menu={menu} icon={basicIcon} />
      )

      const icon = container.querySelector('va-icon[icon="home"]')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('vads-u-background-color--blue')
    })

    it('renders without an icon when not provided', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      const { container } = render(<CustomSideNav menu={menu} />)

      // Should not have the menu icon (close button icon will still exist)
      const menuIcon = container.querySelector('va-icon[icon="home"]')
      expect(menuIcon).toBeNull()
    })

    it('returns null when menu has no links', () => {
      const emptyMenu: SideNavMenu = {
        rootPath: '/test',
        data: {
          name: 'Empty Menu',
          description: null,
          links: [],
        },
      }

      const { container } = render(<CustomSideNav menu={emptyMenu} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Shallow Navigation (depth <= 2)', () => {
    it('renders accordion navigation for shallow menus', () => {
      const menu = createMenu([
        createNavItem('Section 1', '/test/section1', [
          createNavItem('Item 1', '/test/section1/item1'),
          createNavItem('Item 2', '/test/section1/item2'),
        ]),
        createNavItem('Section 2', '/test/section2', [
          createNavItem('Item 3', '/test/section2/item3'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/section1/item1')

      render(<CustomSideNav menu={menu} />)

      // Should render accordion buttons
      const accordionButtons = screen.getAllByRole('button')
      // Filter out the close button
      const sectionButtons = accordionButtons.filter(
        (btn) => !btn.classList.contains('va-sidenav-btn-close')
      )

      expect(sectionButtons).toHaveLength(2)
      expect(sectionButtons[0]).toHaveTextContent('Section 1')
      expect(sectionButtons[1]).toHaveTextContent('Section 2')

      // Links should be inside the accordion content
      expect(screen.getByRole('link', { name: 'Item 1' })).toBeInTheDocument()
    })

    it('expands first accordion by default when no deep links', () => {
      const menu = createMenu([
        createNavItem('Section 1', '/test/section1', [
          createNavItem('Item 1', '/test/section1/item1'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/non-existent')

      render(<CustomSideNav menu={menu} />)

      const accordionButtons = screen.getAllByRole('button')
      const firstSectionButton = accordionButtons.find((btn) =>
        btn.textContent?.includes('Section 1')
      )

      expect(firstSectionButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('applies usa-current class to current page link in accordion', () => {
      const menu = createMenu([
        createNavItem('Section 1', '/test/section1', [
          createNavItem('Item 1', '/test/section1/item1'),
          createNavItem('Item 2', '/test/section1/item2'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/section1/item1')

      render(<CustomSideNav menu={menu} />)

      const currentLink = screen.getByRole('link', { name: 'Item 1' })
      expect(currentLink).toHaveClass('usa-current')
    })
  })

  describe('Deep Navigation (depth > 2)', () => {
    it('renders deep navigation for nested menus', () => {
      mockUsePathname.mockReturnValue('/test/options/program1')

      const menu = createMenu([
        createNavItem('Get benefits', '', [
          createNavItem('Options and eligibility', '/test/options', [
            createNavItem('Program 1', '/test/options/program1'),
            createNavItem('Program 2', '/test/options/program2'),
          ]),
        ]),
      ])

      const { container } = render(<CustomSideNav menu={menu} />)

      // Should show parent link in breadcrumb area
      const breadcrumb = container.querySelector('.sidenav-previous-page')
      expect(breadcrumb).toBeInTheDocument()
      expect(breadcrumb).toHaveTextContent('Options and eligibility')

      // Should show sibling items as links
      expect(
        screen.getByRole('link', { name: 'Program 1' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: 'Program 2' })
      ).toBeInTheDocument()
    })

    it('renders sub-items correctly in deep navigation', () => {
      const menu = createMenu([
        createNavItem('Section', '', [
          createNavItem('Parent', '/test/parent', [
            createNavItem('Child 1', '/test/parent/child1', [
              createNavItem('Grandchild', '/test/parent/child1/grandchild'),
            ]),
            createNavItem('Child 2', '/test/parent/child2'),
          ]),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/parent/child1/grandchild')

      const { container } = render(<CustomSideNav menu={menu} />)

      // Should show parent in breadcrumb
      const breadcrumb = container.querySelector('.sidenav-previous-page')
      expect(breadcrumb).toBeInTheDocument()
      expect(breadcrumb).toHaveTextContent('Child 1')

      // Should show grandchild as a sub-item
      expect(
        screen.getByRole('link', { name: 'Grandchild' })
      ).toBeInTheDocument()
    })

    it('applies active-level class to active path in deep nav', () => {
      const menu = createMenu([
        createNavItem('Section', '', [
          createNavItem('Parent', '/test/parent', [
            createNavItem('Child 1', '/test/parent/child1'),
            createNavItem('Child 2', '/test/parent/child2'),
          ]),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/parent/child1')

      render(<CustomSideNav menu={menu} />)

      const child1Link = screen.getByRole('link', { name: 'Child 1' })
      const listItem = child1Link.closest('li')

      expect(listItem).toHaveClass('active-level')
    })
  })

  describe('Real-world Example: Life Insurance Menu', () => {
    it('correctly handles complex life insurance menu structure', () => {
      const menu = createMenu([
        createNavItem('Life insurance', '/life-insurance', [
          createNavItem('Get benefits', '', [
            createNavItem(
              'Options and eligibility',
              '/life-insurance/options-eligibility',
              [
                createNavItem(
                  "Servicemembers' Group (SGLI)",
                  '/life-insurance/options-eligibility/sgli'
                ),
                createNavItem(
                  "Family Servicemembers' Group (FSGLI)",
                  '/life-insurance/options-eligibility/fsgli'
                ),
                createNavItem(
                  "Veterans' Group (VGLI)",
                  '/life-insurance/options-eligibility/vgli',
                  [
                    createNavItem(
                      'Compare VGLI to other insurance',
                      'https://www.benefits.va.gov/insurance/vgli_rates_compare_vgli.asp'
                    ),
                  ]
                ),
              ]
            ),
          ]),
          createNavItem('Manage benefits', '', [
            createNavItem(
              'Access your policy online',
              '/life-insurance/manage-your-policy'
            ),
          ]),
        ]),
      ])
      mockUsePathname.mockReturnValue(
        '/life-insurance/options-eligibility/sgli/'
      )

      const { container } = render(<CustomSideNav menu={menu} />)

      // Should render deep nav with "Options and eligibility" as parent
      const breadcrumb = container.querySelector('.sidenav-previous-page')
      expect(breadcrumb).toBeInTheDocument()
      expect(breadcrumb).toHaveTextContent('Options and eligibility')

      // Should show SGLI as current
      const sgliLink = screen.getByRole('link', {
        name: "Servicemembers' Group (SGLI)",
      })
      expect(sgliLink).toHaveClass('usa-current')

      // Should show siblings
      expect(
        screen.getByRole('link', {
          name: "Family Servicemembers' Group (FSGLI)",
        })
      ).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('hides sidebar when close button is clicked', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      render(<CustomSideNav menu={menu} />)

      const sidebar = document.getElementById('va-detailpage-sidebar')
      const closeButton = screen.getByRole('button', {
        name: /close this menu/i,
      })

      fireEvent.click(closeButton)

      expect(sidebar).toHaveStyle({ display: 'none' })
    })

    it('hides sidebar when Escape key is pressed', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      render(<CustomSideNav menu={menu} />)

      const sidebar = document.getElementById('va-detailpage-sidebar')

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(sidebar).toHaveStyle({ display: 'none' })
    })

    it('does not hide sidebar for other keys', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      render(<CustomSideNav menu={menu} />)

      const sidebar = document.getElementById('va-detailpage-sidebar')

      fireEvent.keyDown(document, { key: 'Enter' })

      expect(sidebar).not.toHaveStyle({ display: 'none' })
    })

    it('records analytics event when nav link is clicked', () => {
      const menu = createMenu([
        createNavItem('Section 1', '/test/section1', [
          createNavItem('Item 1', '/test/section1/item1'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/section1/item1')

      render(<CustomSideNav menu={menu} />)

      const link = screen.getByRole('link', { name: 'Item 1' })
      fireEvent.click(link)

      expect(mockRecordEvent).toHaveBeenCalledWith({ event: 'nav-sidenav' })
    })

    it('cleans up event listener on unmount', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

      const { unmount } = render(<CustomSideNav menu={menu} />)

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty path strings in navigation items', () => {
      const menu = createMenu([
        createNavItem('Section with no path', '', [
          createNavItem('Actual page', '/test/page'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/page')

      render(<CustomSideNav menu={menu} />)

      expect(
        screen.getByRole('link', { name: 'Actual page' })
      ).toBeInTheDocument()
    })

    it('handles trailing slashes in current path', () => {
      const menu = createMenu([
        createNavItem('Section', '/test/section', [
          createNavItem('Item', '/test/item'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/item/')

      render(<CustomSideNav menu={menu} />)

      const link = screen.getByRole('link', { name: 'Item' })
      expect(link).toHaveClass('usa-current')
    })

    it('handles external URLs', () => {
      const menu = createMenu([
        createNavItem('Section', '/test/section', [
          createNavItem('External Link', 'https://www.example.com/external'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/section')

      render(<CustomSideNav menu={menu} />)

      const externalLink = screen.getByRole('link', { name: 'External Link' })
      expect(externalLink).toHaveAttribute(
        'href',
        'https://www.example.com/external'
      )
    })

    it('handles items with no children', () => {
      const menu = createMenu([
        createNavItem('Item without children', '/test/item', []),
      ])
      mockUsePathname.mockReturnValue('/test/other')

      // Should render accordion nav since depth is shallow
      render(<CustomSideNav menu={menu} />)

      // The item will be a button in accordion mode
      expect(
        screen.getByRole('button', { name: 'Item without children' })
      ).toBeInTheDocument()
    })

    it('handles null icon gracefully', () => {
      const menu = createMenu([createNavItem('Item 1', '/test/item1')])

      const { container } = render(<CustomSideNav menu={menu} icon={null} />)

      // Should not have a menu icon (close button icon will still exist)
      const menuIcon = container.querySelector('.hub-icon')
      expect(menuIcon).toBeNull()
    })
  })

  describe('Active State Classes', () => {
    it('applies active-level class based on path contains logic', () => {
      const menu = createMenu([
        createNavItem('Section 1', '/test/section1', [
          createNavItem('Item 1', '/test/section1/item1'),
          createNavItem('Item 2', '/test/section1/item2'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/section1/item1')

      render(<CustomSideNav menu={menu} />)

      const item1Link = screen.getByRole('link', { name: 'Item 1' })
      const item1Li = item1Link.closest('li')

      expect(item1Li).toHaveClass('active-level')
    })

    it('does not apply active-level to items without matching path', () => {
      const menu = createMenu([
        createNavItem('Section 1', '/test/section1', [
          createNavItem('Item 1', '/test/section1/item1'),
          createNavItem('Item 2', '/test/section1/item2'),
        ]),
      ])
      mockUsePathname.mockReturnValue('/test/section1/item1')

      render(<CustomSideNav menu={menu} />)

      const item2Link = screen.getByRole('link', { name: 'Item 2' })
      const item2Li = item2Link.closest('li')

      expect(item2Li).not.toHaveClass('active-level')
    })
  })
})

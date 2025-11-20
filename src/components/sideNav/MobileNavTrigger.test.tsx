import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { observerInstances, triggerIntersection } from '@/test-utils'
import { MobileNavTrigger } from './MobileNavTrigger'

// Helper function to trigger intersection observer callbacks with act() wrapper
function triggerIntersectionWithAct(
  element: Element,
  isIntersecting: boolean
): void {
  act(() => {
    triggerIntersection(element, isIntersecting)
  })
}

describe('MobileNavTrigger', () => {
  const mockOnToggle = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnToggle.mockClear()
    observerInstances.length = 0
  })

  afterEach(() => {
    observerInstances.length = 0
  })

  describe('Basic Rendering', () => {
    it('renders the trigger button with correct text', () => {
      render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const button = screen.getByRole('button', { name: /in this section/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('In this section')
    })

    it('renders the sentinel element', () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const sentinel = container.querySelector('.sidenav-trigger-sentinel')
      expect(sentinel).toBeInTheDocument()
    })

    it('renders with default sidebarId', () => {
      render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-controls', 'va-detailpage-sidebar')
    })

    it('renders with custom sidebarId when provided', () => {
      render(
        <MobileNavTrigger
          onToggle={mockOnToggle}
          sidebarId="custom-sidebar-id"
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-controls', 'custom-sidebar-id')
    })

    it('renders the trigger with correct id', () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const trigger = container.querySelector('#sidenav-trigger')
      expect(trigger).toBeInTheDocument()
    })

    it('renders the va-icon element', () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const icon = container.querySelector('va-icon[icon="menu"]')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('size', '3')
      expect(icon).toHaveClass('vads-u-color--link-default')
    })
  })

  describe('IntersectionObserver Behavior', () => {
    it('sets up IntersectionObserver on mount', () => {
      render(<MobileNavTrigger onToggle={mockOnToggle} />)

      // Wait for useEffect to run
      expect(observerInstances.length).toBeGreaterThan(0)
    })

    it('does not apply sticky class initially', () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const trigger = container.querySelector('#sidenav-trigger')
      expect(trigger).not.toHaveClass('sidenav-trigger--sticky')
    })

    it('applies sticky class when sentinel is not intersecting', async () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const sentinel = container.querySelector('.sidenav-trigger-sentinel')
      expect(sentinel).toBeInTheDocument()

      // Wait for observer to be set up and find the sentinel element
      await waitFor(() => {
        const instance = observerInstances.find((inst) =>
          inst.elements.includes(sentinel!)
        )
        expect(instance).toBeDefined()
      })

      // Simulate sentinel leaving viewport (scrolled past)
      triggerIntersectionWithAct(sentinel!, false)

      // Wait for state update
      await waitFor(() => {
        const trigger = container.querySelector('#sidenav-trigger')
        expect(trigger).toHaveClass('sidenav-trigger--sticky')
      })
    })

    it('removes sticky class when sentinel becomes intersecting again', async () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const sentinel = container.querySelector('.sidenav-trigger-sentinel')

      // Wait for observer to be set up and find the sentinel element
      await waitFor(() => {
        const instance = observerInstances.find((inst) =>
          inst.elements.includes(sentinel!)
        )
        expect(instance).toBeDefined()
      })

      // First, make it sticky
      triggerIntersectionWithAct(sentinel!, false)
      await waitFor(() => {
        const trigger = container.querySelector('#sidenav-trigger')
        expect(trigger).toHaveClass('sidenav-trigger--sticky')
      })

      // Then, make it intersecting again (scrolled back up)
      triggerIntersectionWithAct(sentinel!, true)
      await waitFor(() => {
        const trigger = container.querySelector('#sidenav-trigger')
        expect(trigger).not.toHaveClass('sidenav-trigger--sticky')
      })
    })

    it('does not render placeholder initially', () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const placeholder = container.querySelector(
        '.sidenav-trigger-placeholder'
      )
      expect(placeholder).not.toBeInTheDocument()
    })

    it('renders placeholder with correct height when sticky', async () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const sentinel = container.querySelector('.sidenav-trigger-sentinel')
      const trigger = container.querySelector('#sidenav-trigger') as HTMLElement

      // Mock offsetHeight
      Object.defineProperty(trigger, 'offsetHeight', {
        configurable: true,
        value: 50,
      })

      // Wait for observer to be set up and find the sentinel element
      await waitFor(() => {
        const instance = observerInstances.find((inst) =>
          inst.elements.includes(sentinel!)
        )
        expect(instance).toBeDefined()
      })

      // Make it sticky
      triggerIntersectionWithAct(sentinel!, false)

      // Wait for placeholder to appear
      await waitFor(() => {
        const placeholder = container.querySelector(
          '.sidenav-trigger-placeholder'
        )
        expect(placeholder).toBeInTheDocument()
        expect(placeholder).toHaveStyle({ height: '50px' })
      })
    })

    it('measures trigger height only once when becoming sticky', async () => {
      const { container } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const sentinel = container.querySelector('.sidenav-trigger-sentinel')
      const trigger = container.querySelector('#sidenav-trigger') as HTMLElement

      // Mock offsetHeight
      const originalHeight = 50
      Object.defineProperty(trigger, 'offsetHeight', {
        configurable: true,
        value: originalHeight,
      })

      // Wait for observer to be set up and find the sentinel element
      await waitFor(() => {
        const instance = observerInstances.find((inst) =>
          inst.elements.includes(sentinel!)
        )
        expect(instance).toBeDefined()
      })

      // Make it sticky
      triggerIntersectionWithAct(sentinel!, false)
      await waitFor(() => {
        const placeholder = container.querySelector(
          '.sidenav-trigger-placeholder'
        )
        expect(placeholder).toHaveStyle({ height: '50px' })
      })

      // Change height
      Object.defineProperty(trigger, 'offsetHeight', {
        configurable: true,
        value: 100,
      })

      // Make it not sticky, then sticky again
      triggerIntersectionWithAct(sentinel!, true)
      await waitFor(() => {
        const placeholder = container.querySelector(
          '.sidenav-trigger-placeholder'
        )
        expect(placeholder).not.toBeInTheDocument()
      })

      triggerIntersectionWithAct(sentinel!, false)
      await waitFor(() => {
        const placeholder = container.querySelector(
          '.sidenav-trigger-placeholder'
        )
        // Should still use the original height (50px), not the new height (100px)
        expect(placeholder).toHaveStyle({ height: '50px' })
      })
    })

    it('cleans up IntersectionObserver on unmount', () => {
      const { unmount } = render(<MobileNavTrigger onToggle={mockOnToggle} />)

      expect(observerInstances.length).toBeGreaterThan(0)

      unmount()

      // Observer should be disconnected
      expect(observerInstances.length).toBe(0)
    })
  })

  describe('User Interactions', () => {
    it('calls onToggle when button is clicked', () => {
      render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('calls onToggle multiple times when button is clicked repeatedly', () => {
      render(<MobileNavTrigger onToggle={mockOnToggle} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(mockOnToggle).toHaveBeenCalledTimes(3)
    })
  })
})

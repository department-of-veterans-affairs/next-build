import { render, screen, axe } from 'test-utils'
import { ResultsSummary } from './ResultsSummary'

describe('ResultsSummary', () => {
  describe('Rendering', () => {
    test('renders results summary with correct format', async () => {
      const { container } = render(
        <ResultsSummary
          filteredCount={50}
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      expect(screen.getByText(/Showing/)).toBeInTheDocument()
      expect(screen.getByText(/of 50 results/)).toBeInTheDocument()

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('displays correct range for first page', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/1-10/)
      expect(visibleRange).toBeInTheDocument()
    })

    test('displays correct range for middle page', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={3}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/21-30/)
      expect(visibleRange).toBeInTheDocument()
    })

    test('displays correct range for last page', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={5}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/41-50/)
      expect(visibleRange).toBeInTheDocument()
    })

    test('displays correct range when last page is partial', () => {
      render(
        <ResultsSummary
          filteredCount={47}
          currentPage={5}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/41-47/)
      expect(visibleRange).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has correct ARIA attributes', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const statusElement = screen.getByRole('status')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement).toHaveAttribute('aria-live', 'polite')
      expect(statusElement).toHaveAttribute('aria-atomic', 'true')
      expect(statusElement).toHaveAttribute('tabIndex', '-1')
    })

    test('has screen reader only text with full context', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={2}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const srOnlyText = screen.getByText(
        /Page 2 of 5, showing items 11 through 20 of 50/
      )
      expect(srOnlyText).toBeInTheDocument()
      expect(srOnlyText).toHaveClass('usa-sr-only')
    })

    test('has screen reader text for no results', () => {
      render(
        <ResultsSummary
          filteredCount={0}
          currentPage={1}
          totalPages={0}
          itemsPerPage={10}
        />
      )

      const srOnlyText = screen.getByText(/No results/)
      expect(srOnlyText).toBeInTheDocument()
      expect(srOnlyText).toHaveClass('usa-sr-only')
    })

    test('has correct element IDs', () => {
      const { container } = render(
        <ResultsSummary
          filteredCount={50}
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      expect(container.querySelector('#total-pages-div')).toBeInTheDocument()
      expect(container.querySelector('#pager-focus')).toBeInTheDocument()
      expect(container.querySelector('#total-pages')).toBeInTheDocument()
      expect(container.querySelector('#total-pages-sr')).toBeInTheDocument()
      expect(container.querySelector('#total-all')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    test('handles zero results', () => {
      const { container } = render(
        <ResultsSummary
          filteredCount={0}
          currentPage={1}
          totalPages={0}
          itemsPerPage={10}
        />
      )

      const visibleRange = container.querySelector('#total-pages')
      expect(visibleRange).toHaveTextContent('0')
      expect(screen.getByText(/of 0 results/)).toBeInTheDocument()
    })

    test('handles single result', () => {
      render(
        <ResultsSummary
          filteredCount={1}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/1-1/)
      expect(visibleRange).toBeInTheDocument()
      expect(screen.getByText(/of 1 results/)).toBeInTheDocument()
    })

    test('handles results less than items per page', () => {
      render(
        <ResultsSummary
          filteredCount={7}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/1-7/)
      expect(visibleRange).toBeInTheDocument()
    })

    test('handles single page with exact items per page', () => {
      render(
        <ResultsSummary
          filteredCount={10}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/1-10/)
      expect(visibleRange).toBeInTheDocument()
    })

    test('handles large page numbers', () => {
      render(
        <ResultsSummary
          filteredCount={1000}
          currentPage={50}
          totalPages={100}
          itemsPerPage={10}
        />
      )

      const visibleRange = screen.getByText(/491-500/)
      expect(visibleRange).toBeInTheDocument()
      expect(screen.getByText(/of 1000 results/)).toBeInTheDocument()
    })

    test('handles different items per page values', () => {
      render(
        <ResultsSummary
          filteredCount={100}
          currentPage={2}
          totalPages={10}
          itemsPerPage={20}
        />
      )

      const visibleRange = screen.getByText(/21-40/)
      expect(visibleRange).toBeInTheDocument()
    })

    test('handles very large item counts', () => {
      render(
        <ResultsSummary
          filteredCount={99999}
          currentPage={100}
          totalPages={1000}
          itemsPerPage={100}
        />
      )

      const visibleRange = screen.getByText(/9901-10000/)
      expect(visibleRange).toBeInTheDocument()
      expect(screen.getByText(/of 99999 results/)).toBeInTheDocument()
    })
  })

  describe('Screen reader announcements', () => {
    test('announces correct page information for first page', () => {
      render(
        <ResultsSummary
          filteredCount={25}
          currentPage={1}
          totalPages={3}
          itemsPerPage={10}
        />
      )

      const srText = screen.getByText(
        /Page 1 of 3, showing items 1 through 10 of 25/
      )
      expect(srText).toBeInTheDocument()
    })

    test('announces correct page information for last page', () => {
      render(
        <ResultsSummary
          filteredCount={25}
          currentPage={3}
          totalPages={3}
          itemsPerPage={10}
        />
      )

      const srText = screen.getByText(
        /Page 3 of 3, showing items 21 through 25 of 25/
      )
      expect(srText).toBeInTheDocument()
    })

    test('announces no results correctly', () => {
      render(
        <ResultsSummary
          filteredCount={0}
          currentPage={1}
          totalPages={0}
          itemsPerPage={10}
        />
      )

      const srText = screen.getByText(/No results/)
      expect(srText).toBeInTheDocument()
    })
  })

  describe('Visual display', () => {
    test('hides detailed information from visual display', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={2}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      // The visual display should show "11-20" but not the full page context
      const visualRange = screen.getByText(/11-20/)
      expect(visualRange).toBeInTheDocument()
      expect(visualRange).toHaveAttribute('aria-hidden', 'true')
    })

    test('shows total count in visual display', () => {
      render(
        <ResultsSummary
          filteredCount={50}
          currentPage={1}
          totalPages={5}
          itemsPerPage={10}
        />
      )

      const totalCount = screen.getByText(/of 50 results/)
      expect(totalCount).toBeInTheDocument()
    })
  })
})

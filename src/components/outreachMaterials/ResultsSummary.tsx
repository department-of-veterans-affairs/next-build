interface ResultsSummaryProps {
  filteredCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
}

export function ResultsSummary({
  filteredCount,
  currentPage,
  totalPages,
  itemsPerPage,
}: ResultsSummaryProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, filteredCount)

  return (
    <div id="total-pages-div" className="vads-u-margin-bottom--1">
      <div
        aria-live="polite"
        aria-atomic="true"
        id="pager-focus"
        role="status"
        tabIndex={-1}
      >
        <span>
          Showing{' '}
          <span aria-hidden="true" id="total-pages">
            {filteredCount > 0 ? `${startIndex}-${endIndex}` : '0'}
          </span>
          <span className="usa-sr-only" id="total-pages-sr">
            {filteredCount > 0
              ? `Page ${currentPage} of ${totalPages}, showing items ${startIndex} through ${endIndex} of ${filteredCount}`
              : 'No results'}
          </span>
          <span id="total-all"> of {filteredCount} results</span>
        </span>
      </div>
    </div>
  )
}

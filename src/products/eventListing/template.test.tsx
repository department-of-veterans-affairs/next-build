import { render, screen } from '@testing-library/react'
import { EventListing } from './template'
import { mockResponse } from '@/products/eventListing/mock.js'
import { formatter } from '@/products/eventListing/query'

describe('EventListing with valid data', () => {
  const resource = formatter({
    entity: mockResponse,
    events: [],
    menu: { items: [], tree: [] },
    totalItems: 0,
    totalPages: 1,
  })
  test('renders EventListing component', () => {
    render(<EventListing {...resource} />)

    expect(screen.queryByText(/Events/)).toBeInTheDocument()
  })
})

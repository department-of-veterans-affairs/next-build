import { render, screen } from '@testing-library/react'
import { EventListing } from './index'
import { mockResponse } from '@/mocks/eventListing.mock.js'
import { formatter } from '@/data/queries/eventListing'

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

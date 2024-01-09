import { render, screen } from '@testing-library/react'
import { EventListing } from './index'
import mockData from '@/mocks/eventListing.mock.json'
import { formatter } from '@/data/queries/eventListing'

describe('EventListing with valid data', () => {
  const resource = formatter({
    entity: mockData,
    events: [],
    menu: { items: [], tree: [] },
  })
  test('renders EventListing component', () => {
    render(<EventListing {...resource} />)

    expect(screen.queryByText(/Events/)).toBeInTheDocument()
  })
})

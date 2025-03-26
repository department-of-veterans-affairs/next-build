import React from 'react'
import { render, screen } from '@testing-library/react'
import { LeadershipListing } from './index'


describe('LeadershipListing with valid data', () => {
  test('renders LeadershipListing component', () => {
    render(
      <LeadershipListing
        id="1234"
        type="node--leadership_listing"
        published={true}
        lastUpdated="2022-01-01T00:00:00Z"
        introText="Some test intro text"
        leadership={null}
        menu={null}
        title="Leadership"
      />
    )

    expect(screen.queryByText(/Some test intro text/)).toBeInTheDocument()
    expect(screen.getByRole('heading', 1)).toHaveTextContent('Leadership')
  })
})

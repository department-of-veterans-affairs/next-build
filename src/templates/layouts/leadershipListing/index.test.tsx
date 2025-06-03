import React from 'react'
import { render, screen } from '@testing-library/react'
import { LeadershipListing } from './index'

describe('LeadershipListing with valid data', () => {
  test('renders LeadershipListing component with intro text', () => {
    render(
      <LeadershipListing
        id="test-id"
        type="test-type"
        published={true}
        lastUpdated={new Date().toISOString()}
        title={'Hello world'}
        introText={'This is an intro text.'}
        menu={null}
        profiles={[]}
      />
    )

    expect(screen.queryByText(/This is an intro text./)).toBeInTheDocument()
  })

  test('renders LeadershipListing component with side nav', () => {
    const mockMenu = {
      items: [],
      title: 'Mock Menu',
      rootPath: '/',
      data: {
        name: 'Section 1',
        description: 'Description for section 1',
        links: [],
      },
    }

    render(
      <LeadershipListing
        id="test-id"
        type="test-type"
        published={true}
        lastUpdated={new Date().toISOString()}
        title={'Hello world'}
        menu={mockMenu}
        introText={'This is an intro text.'}
        profiles={[]}
      />
    )

    // @ts-expect-error window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockMenu)
  })
})

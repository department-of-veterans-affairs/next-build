import React from 'react'
import { render, screen } from '@testing-library/react'
import drupalMockData from '@/mocks/vamcSystem.mock.json'
import { VamcSystem } from './index'
import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
import { formatter } from '@/data/queries/vamcSystem'
import { DrupalMenuLinkContent } from 'next-drupal'

const menuItem: DrupalMenuLinkContent = {
  title: 'Foo',
  type: 'meh',
  url: '/nowhere/in-particular',
  id: 'foo',
  description: 'bar',
  enabled: true,
  expanded: true,
  menu_name: 'baz',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

const mockMenu = {
  items: [menuItem],
  tree: [menuItem],
}

const mockData = formatter({
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  entity: drupalMockData,
  menu: mockMenu,
  lovell: { isLovellVariantPage: false, variant: 'va' },
})

describe('VamcSystem with valid data', () => {
  test('renders VamcSystem component with basic data', () => {
    render(<VamcSystem {...mockData} />)

    const basicDataFields: Array<keyof FormattedVamcSystem> = [
      'title',
      'introText',
    ]
    basicDataFields.forEach((key) =>
      expect(screen.getByText(mockData[key])).toBeInTheDocument()
    )
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystem {...mockData} />)

    // @ts-expect-error - window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })

  test('renders the administration information in a "manage your health online" section', () => {
    render(<VamcSystem {...mockData} />)
    expect(screen.getByText('Manage your health online')).toBeInTheDocument()
    // TODO: Look for other info once we fill out this section. Note that just looking
    // for the administration name in the document is not enough because it's the same
    // as the page title.
  })

  test('does not render the "manage your health online" section if the administration is 1039', () => {
    render(
      <VamcSystem
        {...mockData}
        administration={{ ...mockData.administration, id: 1039 }}
      />
    )
    expect(
      screen.queryByText('Manage your health online')
    ).not.toBeInTheDocument()
  })

  test('uses an alternate title for the administration section if the administration is 1040', () => {
    render(
      <VamcSystem
        {...mockData}
        administration={{ ...mockData.administration, id: 1040 }}
      />
    )
    expect(screen.getByText('Manage your VA health online')).toBeInTheDocument()
  })

  test('renders the facility image with correct attributes', () => {
    render(<VamcSystem {...mockData} />)

    const image = screen.getByRole('presentation')
    expect(image).toBeInTheDocument()
    expect(image.getAttribute('src')).toBeTruthy()
  })
})

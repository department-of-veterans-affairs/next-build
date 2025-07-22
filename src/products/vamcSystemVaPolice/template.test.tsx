import React from 'react'
import { render, screen } from '@testing-library/react'
import drupalMockData from '@/products/vamcSystemVaPolice/mock.json'
import { VamcSystemVaPolice } from './template'
import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '@/products/vamcSystemVaPolice/formatted-type'
import { formatter } from '@/products/vamcSystemVaPolice/query'
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
  // drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem.
  entity: drupalMockData,
  menu: mockMenu,
})

describe('VamcSystemVaPolice with valid data', () => {
  test('renders VamcSystemVaPolice component', () => {
    render(<VamcSystemVaPolice {...mockData} />)

    const basicDataFields: Array<keyof FormattedVamcSystemVaPolice> = ['title']
    basicDataFields.forEach((key) =>
      expect(screen.getByText(mockData[key])).toBeInTheDocument()
    )
  })
  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemVaPolice {...mockData} />)

    // @ts-expect-error - window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })
  test('renders the police overview', () => {
    render(<VamcSystemVaPolice {...mockData} />)
    expect(
      screen.getByText(
        'VA police officers help make VA medical centers and other VA health facilities safe for Veterans and their family members.'
      )
    ).toBeInTheDocument()
  })
})

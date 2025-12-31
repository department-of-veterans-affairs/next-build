import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import drupalMockData from '@/components/vamcSystemVaPolice/mock.json'
import { VamcSystemVaPolice } from './template'
import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from './formatted-type'
import { formatter } from './query'
import { DrupalMenuLinkContent } from 'next-drupal'
import { NodeVamcSystemVaPolice } from '@/types/drupal/node'

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
  entity: drupalMockData as NodeVamcSystemVaPolice,
  vamcSystem: null,
  menu: mockMenu,
})

describe('VamcSystemVaPolice with valid data', () => {
  test('renders VamcSystemVaPolice component', async () => {
    const { container } = render(<VamcSystemVaPolice {...mockData} />)

    const basicDataFields: Array<keyof FormattedVamcSystemVaPolice> = ['title']
    basicDataFields.forEach((key) =>
      expect(screen.getByText(mockData[key])).toBeInTheDocument()
    )

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemVaPolice {...mockData} />)

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

import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemDetailPage from './template'
import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import { Menu } from '@/types/drupal/menu'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'
import { formatter } from './query'
import { LOVELL } from '@/lib/drupal/lovell/constants'

describe('VamcSystemDetailPage', () => {
  const formattedMockData = formatter({
    entity: mockPage as NodeVamcSystemDetailPage,
    menu: mockMenu as unknown as Menu,
    lovell: null,
  })

  it('renders the title', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('renders intro text when provided', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(
      screen.getByText(
        "Explore VA Bronx's research initiatives with specialty programs in [List research here] . You can also volunteer to participate in a research study."
      )
    ).toBeInTheDocument()
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(window.sideNav).toEqual(formattedMockData.menu)
  })

  describe('Related links', () => {
    it('renders list of link teasers when related links are provided', () => {
      render(<VamcSystemDetailPage {...formattedMockData} />)

      // Check that the related links section is rendered
      expect(screen.getByText('More information')).toBeInTheDocument()
      expect(
        screen.getByText(/You should keep copies of your medical/)
      ).toBeInTheDocument()
    })

    it('does not render list of link teasers when related links are null', () => {
      render(
        <VamcSystemDetailPage {...formattedMockData} relatedLinks={null} />
      )

      // Check that the related links section is not rendered
      expect(screen.queryByText('More information')).not.toBeInTheDocument()
      expect(
        screen.queryByText(/You should keep copies of your medical/)
      ).not.toBeInTheDocument()
    })
  })

  describe.skip('LovellSwitcher integration', () => {
    test('renders LovellSwitcher for TRICARE variant', () => {
      const dataWithLovell = {
        ...formattedMockData,
        lovellVariant: LOVELL.tricare.variant,
        lovellSwitchPath: '/lovell-federal-health-care-va',
      }

      const { container } = render(<VamcSystemDetailPage {...dataWithLovell} />)

      // Look for the LovellSwitcher content
      expect(
        screen.getByText('You are viewing this page as a TRICARE beneficiary.')
      ).toBeInTheDocument()

      // Check for the va-link component with the correct text attribute
      const switcherLink = container.querySelector(
        'va-alert va-link[text="View this page as a VA beneficiary"]'
      )
      expect(switcherLink).toBeInTheDocument()
      expect(switcherLink).toHaveAttribute(
        'href',
        dataWithLovell.lovellSwitchPath
      )
    })

    test('does not render LovellSwitcher when lovellVariant is missing', () => {
      render(<VamcSystemDetailPage {...formattedMockData} />)

      // Should not find LovellSwitcher content
      expect(
        screen.queryByText(/You are viewing this page as a .* beneficiary/)
      ).not.toBeInTheDocument()
    })
  })
})

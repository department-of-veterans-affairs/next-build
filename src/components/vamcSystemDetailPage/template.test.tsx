import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import VamcSystemDetailPage from './template'
import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import mockVamcSystem from '@/components/vamcSystem/mock.shallow.json'
import { Menu } from '@/types/drupal/menu'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'
import { formatter } from './query'
import { LOVELL } from '@/lib/drupal/lovell/constants'
import { ShallowVamcSystem } from '@/components/vamcSystem/vamcSystemAndMenu'

describe('VamcSystemDetailPage', () => {
  const formattedMockData = formatter({
    entity: mockPage as unknown as NodeVamcSystemDetailPage,
    vamcSystem: mockVamcSystem as ShallowVamcSystem,
    menu: mockMenu as unknown as Menu,
    lovell: null,
    hasLovellCounterpart: false,
  })

  test('renders the title', async () => {
    const { container } = render(
      <VamcSystemDetailPage {...formattedMockData} />
    )
    expect(screen.getByText('Mission and vision')).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders intro text when provided', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(
      screen.getByText(
        /The mission of the Durham VA Medical Center and clinics is to make a positive difference/
      )
    ).toBeInTheDocument()
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemDetailPage {...formattedMockData} />)
    expect(window.sideNav).toEqual(formattedMockData.menu)
  })

  describe('Featured content', () => {
    test('renders featured content when provided', () => {
      render(<VamcSystemDetailPage {...formattedMockData} />)
      expect(
        screen.getByText(/Beginning Sept. 6 and continuing through November/)
      ).toBeInTheDocument()
    })

    test('does not render featured content div when featuredContent is null', () => {
      const { container } = render(
        <VamcSystemDetailPage {...formattedMockData} featuredContent={null} />
      )
      expect(container.querySelector('.feature')).not.toBeInTheDocument()
    })

    test('does not render featured content block when featuredContent is empty', () => {
      const { container } = render(
        <VamcSystemDetailPage {...formattedMockData} featuredContent={[]} />
      )
      expect(container.querySelector('.feature')).not.toBeInTheDocument()
    })
  })

  describe('Related links', () => {
    test('renders list of link teasers when related links are provided', () => {
      render(<VamcSystemDetailPage {...formattedMockData} />)

      // Check that the related links section is rendered
      expect(
        screen.getByText('Learn more about how we serve Veterans')
      ).toBeInTheDocument()
    })

    test('does not render list of link teasers when related links are null', () => {
      render(
        <VamcSystemDetailPage {...formattedMockData} relatedLinks={null} />
      )

      // Check that the related links section is not rendered
      expect(
        screen.queryByText('Learn more about how we serve Veterans')
      ).not.toBeInTheDocument()
    })
  })

  describe('LovellSwitcher integration', () => {
    const dataWithLovell = {
      ...formattedMockData,
      lovellVariant: LOVELL.tricare.variant,
      lovellSwitchPath: '/lovell-federal-health-care-va',
      showLovellSwitcher: true,
    }

    test('renders LovellSwitcher for TRICARE variant when showLovellSwitcher is true', () => {
      const { container } = render(
        <VamcSystemDetailPage {...dataWithLovell} showLovellSwitcher={true} />
      )

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

    test('does not render LovellSwitcher when showLovellSwitcher is false', () => {
      render(
        <VamcSystemDetailPage {...dataWithLovell} showLovellSwitcher={false} />
      )

      // Should not find LovellSwitcher content
      expect(
        screen.queryByText(/You are viewing this page as a .* beneficiary/)
      ).not.toBeInTheDocument()
    })
  })

  describe('Top tasks', () => {
    const getLink = (text: string) =>
      document.querySelector(`va-link-action[text="${text}"]`)

    test('renders top tasks when this is a contact page', () => {
      render(
        <VamcSystemDetailPage {...formattedMockData} entityPath="/contact-us" />
      )
      expect(getLink('Make an appointment')).toBeInTheDocument()
      expect(getLink('View all health services')).toBeInTheDocument()
      expect(getLink('Register for care')).toBeInTheDocument()

      // Make sure the links go to the right place
      expect(getLink('Make an appointment')).toHaveAttribute(
        'href',
        `${formattedMockData.vamcSystem.path}/make-an-appointment`
      )
      expect(getLink('View all health services')).toHaveAttribute(
        'href',
        `${formattedMockData.vamcSystem.path}/health-services`
      )
      expect(getLink('Register for care')).toHaveAttribute(
        'href',
        `${formattedMockData.vamcSystem.path}/register-for-care`
      )
    })

    test('renders the TRICARE variant with the MHS link when this is a TRICARE contact page', () => {
      render(
        <VamcSystemDetailPage
          {...formattedMockData}
          entityPath="/contact-us"
          administration={LOVELL.tricare.administration}
          vamcEhrSystem="cerner"
        />
      )
      expect(getLink('MHS Genesis Patient Portal')).toBeInTheDocument()
      expect(getLink('View all health services')).toBeInTheDocument()
      expect(getLink('Register for care')).toBeInTheDocument()
    })
  })
})

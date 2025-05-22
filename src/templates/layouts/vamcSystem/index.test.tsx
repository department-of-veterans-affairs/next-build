import React from 'react'
import { render, screen } from '@testing-library/react'
import drupalMockData from '@/mocks/vamcSystem.mock.json'
import drupalMockFacilityData from '@/mocks/healthCareLocalFacility.mock.json'
import { VamcSystem } from './index'
import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
import { formatter } from '@/data/queries/vamcSystem'
import { DrupalMenuLinkContent } from 'next-drupal'
import { LOVELL } from '@/lib/drupal/lovell/constants'

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
  // @ts-expect-error drupalMockData technically has numbers instead of strings
  // for some of the IDs, but this is a known problem. See
  // https://github.com/chapter-three/next-drupal/issues/686#issuecomment-2083175598
  mainFacilities: [drupalMockFacilityData],
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
        administrationId={LOVELL.tricare.administrationId}
      />
    )
    expect(
      screen.queryByText('Manage your health online')
    ).not.toBeInTheDocument()
  })

  test('uses an alternate title for the administration section if the administration is 1040', () => {
    render(
      <VamcSystem {...mockData} administrationId={LOVELL.va.administrationId} />
    )
    expect(screen.getByText('Manage your VA health online')).toBeInTheDocument()
  })

  test('renders the facility image with correct attributes', () => {
    render(<VamcSystem {...mockData} />)

    const image = screen.getByRole('presentation')
    expect(image).toBeInTheDocument()
    expect(image.getAttribute('src')).toBeTruthy()
  })

  describe('Locations section', () => {
    test('renders the locations section heading', () => {
      render(<VamcSystem {...mockData} />)
      expect(
        screen.getByRole('heading', { name: 'Locations' })
      ).toBeInTheDocument()
    })

    test('renders facility listings for each main facility', () => {
      render(<VamcSystem {...mockData} />)

      // Check that each facility's title is rendered within a va-link component
      mockData.mainFacilities.forEach((facility) => {
        const facilityLink = screen.getByRole('link', { name: facility.title })
        expect(facilityLink).toBeInTheDocument()
        expect(facilityLink).toHaveAttribute(
          'href',
          expect.stringContaining(facility.path)
        )
      })
    })

    test('renders the "See all locations" link with correct href', () => {
      const { container } = render(<VamcSystem {...mockData} />)

      const seeAllLink = container.querySelector(
        'va-link[text="See all locations"]'
      )
      expect(seeAllLink).toBeInTheDocument()

      // Find the parent va-link element and check its attributes
      const vaLink = seeAllLink.closest('va-link')
      expect(vaLink).toBeInTheDocument()
      expect(vaLink).toHaveAttribute('href', `${mockData.path}/locations`)
      expect(vaLink).toHaveAttribute('text', 'See all locations')
      expect(vaLink).toHaveAttribute('active', 'true')
    })

    test('renders facility details including address and phone numbers', () => {
      render(<VamcSystem {...mockData} />)

      // Check for address
      expect(screen.getByText(/251 Causeway Street/)).toBeInTheDocument()
      expect(screen.getByText(/Boston, MA 02114-2104/)).toBeInTheDocument()

      // Check for phone numbers
      expect(screen.getByText('Main phone:')).toBeInTheDocument()
      expect(screen.getByText('VA health connect:')).toBeInTheDocument()
      expect(screen.getByText('Mental health phone:')).toBeInTheDocument()
    })
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import drupalMockData from '@/mocks/vamcSystem.mock.json'
import drupalMockFacilityData from '@/mocks/healthCareLocalFacility.mock'
import drupalMockStoryData from '@/mocks/newsStory.mock.json'
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
  lovell: { isLovellVariantPage: false, variant: undefined },
  mainFacilities: [drupalMockFacilityData],
  featuredStories: [drupalMockStoryData],
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

  describe('RegionalTopTasks', () => {
    test('renders all expected va-link-action elements with correct attributes', () => {
      const { container } = render(<VamcSystem {...mockData} />)

      // Check for "Make an appointment" link
      const appointmentLink = container.querySelector(
        'va-link-action[text="Make an appointment"]'
      )
      expect(appointmentLink).toBeInTheDocument()
      expect(appointmentLink).toHaveAttribute(
        'href',
        `${mockData.path}/make-an-appointment`
      )

      // Check for "View all health services" link
      const healthServicesLink = container.querySelector(
        'va-link-action[text="View all health services"]'
      )
      expect(healthServicesLink).toBeInTheDocument()
      expect(healthServicesLink).toHaveAttribute(
        'href',
        `${mockData.path}/health-services`
      )

      // Check for "Register for care" link
      const registerLink = container.querySelector(
        'va-link-action[text="Register for care"]'
      )
      expect(registerLink).toBeInTheDocument()
      expect(registerLink).toHaveAttribute(
        'href',
        `${mockData.path}/register-for-care`
      )
    })

    test('renders MHS Genesis Patient Portal link for Lovell Tricare with Cerner', () => {
      const lovellData = {
        ...mockData,
        administration: LOVELL.tricare.administration,
        vamcEhrSystem: 'cerner' as const,
      }
      const { container } = render(<VamcSystem {...lovellData} />)

      const genesisLink = container.querySelector(
        'va-link-action[text="MHS Genesis Patient Portal"]'
      )
      expect(genesisLink).toBeInTheDocument()
      expect(genesisLink).toHaveAttribute(
        'href',
        'https://my.mhsgenesis.health.mil/'
      )
    })
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
        administration={LOVELL.tricare.administration}
      />
    )
    expect(
      screen.queryByText('Manage your health online')
    ).not.toBeInTheDocument()
  })

  test('uses an alternate title for the administration section if the administration is 1040', () => {
    render(
      <VamcSystem {...mockData} administration={LOVELL.va.administration} />
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
      expect(screen.getByText('Mental health care:')).toBeInTheDocument()
    })
  })

  describe('LovellSwitcher integration', () => {
    test('renders LovellSwitcher when both lovellVariant and lovellSwitchPath are provided', () => {
      const dataWithLovell = {
        ...mockData,
        lovellVariant: LOVELL.va.variant,
        lovellSwitchPath: '/lovell-federal-health-care-tricare',
      }

      render(<VamcSystem {...dataWithLovell} />)

      // Look for the LovellSwitcher content
      expect(
        screen.getByText('You are viewing this page as a VA beneficiary.')
      ).toBeInTheDocument()

      // Check for the va-link component with the correct text attribute
      const { container } = render(<VamcSystem {...dataWithLovell} />)
      const switcherLink = container.querySelector(
        'va-alert va-link[text="View this page as a TRICARE beneficiary"]'
      )
      expect(switcherLink).toBeInTheDocument()
      expect(switcherLink).toHaveAttribute(
        'href',
        dataWithLovell.lovellSwitchPath
      )
    })

    test('renders LovellSwitcher for TRICARE variant', () => {
      const dataWithLovell = {
        ...mockData,
        lovellVariant: LOVELL.tricare.variant,
        lovellSwitchPath: '/lovell-federal-health-care-va',
      }

      const { container } = render(<VamcSystem {...dataWithLovell} />)

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
      render(<VamcSystem {...mockData} />)

      // Should not find LovellSwitcher content
      expect(
        screen.queryByText(/You are viewing this page as a .* beneficiary/)
      ).not.toBeInTheDocument()
    })
  })

  describe('Stories section', () => {
    test('renders the stories section heading when featured stories exist', () => {
      render(<VamcSystem {...mockData} />)
      expect(
        screen.getByRole('heading', { name: 'Stories' })
      ).toBeInTheDocument()
    })

    test('renders featured stories up to the maximum limit', () => {
      // Create test data with more than MAX_FEATURED_STORIES (2) stories
      const mockStoryData = {
        id: 'story-id',
        type: 'node--news_story',
        published: true,
        title: 'Test Story',
        introText: 'Test intro text',
        link: '/test-story',
        image: mockData.featuredStories[0].image,
        lastUpdated: '2021-05-25T14:00:00.000Z',
      }

      const dataWithMultipleStories = {
        ...mockData,
        featuredStories: [
          { ...mockStoryData, id: 'story-1', title: 'Story 1' },
          { ...mockStoryData, id: 'story-2', title: 'Story 2' },
          { ...mockStoryData, id: 'story-3', title: 'Story 3' },
        ],
      }

      const { container } = render(<VamcSystem {...dataWithMultipleStories} />)

      // Should render only the first 2 stories (MAX_FEATURED_STORIES = 2)
      const story1Link = container.querySelector('va-link[text="Story 1"]')
      const story2Link = container.querySelector('va-link[text="Story 2"]')
      const story3Link = container.querySelector('va-link[text="Story 3"]')

      expect(story1Link).toBeInTheDocument()
      expect(story2Link).toBeInTheDocument()
      expect(story3Link).not.toBeInTheDocument()
    })

    test('renders story titles as links with correct hrefs', () => {
      const { container } = render(<VamcSystem {...mockData} />)

      // Check that each featured story's title is rendered as a va-link
      mockData.featuredStories.forEach((story) => {
        const storyLink = container.querySelector(
          `va-link[text="${story.title}"]`
        )
        expect(storyLink).toBeInTheDocument()
        expect(storyLink).toHaveAttribute('href', story.link)
      })
    })

    test('renders story intro text', () => {
      render(<VamcSystem {...mockData} />)

      mockData.featuredStories.forEach((story) => {
        // The intro text is truncated in the NewsStoryTeaser component
        // We'll just check that some portion of it appears
        const introTextWords = story.introText.split(' ').slice(0, 5).join(' ')
        expect(screen.getByText(new RegExp(introTextWords))).toBeInTheDocument()
      })
    })

    test('renders the "See all stories" link with correct href', () => {
      const { container } = render(<VamcSystem {...mockData} />)

      const seeAllLink = container.querySelector(
        'va-link[text="See all stories"]'
      )
      expect(seeAllLink).toBeInTheDocument()
      expect(seeAllLink).toHaveAttribute('href', `${mockData.path}/stories`)
      expect(seeAllLink).toHaveAttribute('text', 'See all stories')
      expect(seeAllLink).toHaveAttribute('active', 'true')
    })

    test('does not render the stories section when no featured stories exist', () => {
      const dataWithoutStories = {
        ...mockData,
        featuredStories: [],
      }

      render(<VamcSystem {...dataWithoutStories} />)

      expect(
        screen.queryByRole('heading', { name: 'Stories' })
      ).not.toBeInTheDocument()
      expect(screen.queryByText('See all stories')).not.toBeInTheDocument()
    })
  })

  describe('Social Links section', () => {
    test('renders the social links section when social links data is provided', () => {
      const { container } = render(<VamcSystem {...mockData} />)

      // Check that the social links section is rendered
      expect(
        screen.getByRole('heading', { name: 'VA New York Harbor health care' })
      ).toBeInTheDocument()

      // Check that Facebook link is rendered with correct attributes
      const facebookLink = container.querySelector(
        `va-link[text="${mockData.socialLinks.fieldFacebook.title}"]`
      )
      expect(facebookLink).toBeInTheDocument()
      expect(facebookLink).toHaveAttribute(
        'href',
        mockData.socialLinks.fieldFacebook.uri
      )
    })
  })
})

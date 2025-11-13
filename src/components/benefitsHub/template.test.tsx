import React from 'react'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { BenefitsHub } from './template'

const mockBenefitsData: FormattedBenefitsHub = {
  id: '1',
  type: '',
  published: true,
  lastUpdated: '2021-10-31T17:26:37+00:00',
  title: 'Test Health Benefits Hub',
  titleIcon: null,
  intro: 'This is a test intro for the Benefits Hub component.',
  spokes: [],
  fieldLinks: null,
  relatedLinks: null,
}

describe('BenefitsHub with valid data', () => {
  test('renders BenefitsHub component', async () => {
    const { container } = render(
      <BenefitsHub
        id="1"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Test Health Benefits Hub'}
        titleIcon={null}
        spokes={[]}
        intro={null}
        fieldLinks={null}
        relatedLinks={null}
      />
    )

    expect(screen.queryByText(/Test Health Benefits Hub/)).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders BenefitsHub component with intro text', () => {
    render(
      <BenefitsHub
        id="2"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Health Care'}
        titleIcon={null}
        spokes={[]}
        intro={'This is a test intro for the Benefits Hub component.'}
        fieldLinks={null}
        relatedLinks={null}
      />
    )

    expect(
      screen.queryByText(/This is a test intro for the Benefits Hub component./)
    ).toBeInTheDocument()
  })

  test('renders BenefitsHub component with icon', () => {
    render(
      <BenefitsHub
        id="3"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Disability'}
        titleIcon={'disability'}
        spokes={[]}
        intro={'Learn about disability compensation.'}
        fieldLinks={null}
        relatedLinks={null}
      />
    )

    expect(screen.queryByText(/Disability/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Learn about disability compensation./)
    ).toBeInTheDocument()

    // Test that the va-icon element is rendered with the correct icon and styling
    const vaIcon = document.querySelector('va-icon')
    expect(vaIcon).toBeInTheDocument()
    expect(vaIcon).toHaveAttribute('icon', 'description')
    expect(vaIcon).toHaveAttribute('size', '3')
    expect(vaIcon).toHaveClass('hub-icon')
    expect(vaIcon).toHaveClass('vads-u-background-color--hub-disability')
  })

  test('renders BenefitsHub component with spokes', () => {
    const mockSpokes = [
      {
        type: 'paragraph--list_of_link_teasers' as const,
        id: 'spoke-1',
        entityId: 1,
        title: 'Get VA health care',
        isHubPage: true,
        linkTeasers: [
          {
            type: 'paragraph--link_teaser' as const,
            id: 'teaser-1',
            entityId: 2,
            uri: '/health-care/apply/',
            title: 'Apply for health care',
            options: [],
            summary: 'Apply for VA health care benefits',
            isHubPage: true,
            componentParams: {
              sectionHeader: 'Get VA health care',
            },
          },
        ],
      },
    ]

    render(
      <BenefitsHub
        id="4"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Health Care'}
        titleIcon={'health-care'}
        intro={'Manage your VA health care.'}
        spokes={mockSpokes}
        fieldLinks={null}
        relatedLinks={null}
      />
    )

    expect(screen.queryByText(/Health Care/)).toBeInTheDocument()
    expect(screen.queryByText(/Get VA health care/)).toBeInTheDocument()

    // Check for va-link with text attribute
    const vaLink = document.querySelector(
      'va-link[text="Apply for health care"]'
    )
    expect(vaLink).toBeInTheDocument()

    // Also check for the summary text which should be visible
    expect(
      screen.queryByText(/Apply for VA health care benefits/)
    ).toBeInTheDocument()
  })
  test('renders ContentFooter with lastUpdated date', () => {
    render(<BenefitsHub {...mockBenefitsData} />)
    expect(screen.getByTestId('content-footer')).toBeInTheDocument()
    expect(screen.getByText('Last updated:')).toBeInTheDocument()
    expect(screen.getByText('October 31, 2021')).toBeInTheDocument()
    expect(screen.getByText('October 31, 2021')).toHaveAttribute(
      'dateTime',
      '2021-10-31'
    )
  })

  test('renders BenefitsHub component with relatedLinks', () => {
    const mockRelatedLinks = {
      id: 'related-links-1',
      type: 'paragraph--list_of_link_teasers' as const,
      entityId: 123,
      title: 'Related Information',
      linkTeasers: [
        {
          type: 'paragraph--link_teaser' as const,
          id: 'related-teaser-1',
          entityId: null,
          uri: '/related-info-1/',
          title: 'Related Topic 1',
          options: [],
          summary: null,
          isHubPage: true,
          componentParams: {},
        },
        {
          type: 'paragraph--link_teaser' as const,
          id: 'related-teaser-2',
          entityId: null,
          uri: '/related-info-2/',
          title: 'Related Topic 2',
          options: [],
          summary: null,
          isHubPage: true,
          componentParams: {},
        },
      ],
    }

    render(
      <BenefitsHub
        id="6"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Benefits Hub with Related Links'}
        titleIcon={null}
        intro={'Information with related links.'}
        spokes={[]}
        fieldLinks={null}
        relatedLinks={mockRelatedLinks}
      />
    )

    expect(
      screen.getByRole('heading', { name: /Benefits Hub with Related Links/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Related Information/ })
    ).toBeInTheDocument()

    // Check that related links section has the correct CSS classes
    const relatedSection = document.querySelector(
      '.merger-majorlinks.va-nav-linkslist.va-nav-linkslist--related'
    )
    expect(relatedSection).toBeInTheDocument()

    // Check for va-link elements with correct attributes for related links
    const relatedLink1 = document.querySelector(
      'va-link[text="Related Topic 1"]'
    )
    expect(relatedLink1).toBeInTheDocument()
    expect(relatedLink1).toHaveAttribute('href', '/related-info-1/')

    const relatedLink2 = document.querySelector(
      'va-link[text="Related Topic 2"]'
    )
    expect(relatedLink2).toBeInTheDocument()
    expect(relatedLink2).toHaveAttribute('href', '/related-info-2/')
  })

  test('renders BenefitsHub component with fieldLinks (Not a Veteran section)', () => {
    const mockFieldLinks = [
      {
        title: 'Family members and caregivers',
        url: {
          path: '/family-and-caregiver-benefits/',
        },
      },
      {
        title: 'Service members',
        url: {
          path: '/service-member-benefits/',
        },
      },
    ]

    render(
      <BenefitsHub
        id="5"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Benefits Hub'}
        titleIcon={null}
        intro={'Information for different audiences.'}
        spokes={[]}
        fieldLinks={mockFieldLinks}
        relatedLinks={null}
      />
    )

    expect(screen.queryByText(/Benefits Hub/)).toBeInTheDocument()
    expect(screen.queryByText(/Get information for:/)).toBeInTheDocument()

    // Check for va-accordion-item with correct header attribute
    const accordionItem = document.querySelector('va-accordion-item')
    expect(accordionItem).toBeInTheDocument()
    expect(accordionItem).toHaveAttribute(
      'header',
      'Not a Veteran or family member?'
    )

    // Check for va-link elements with correct attributes
    const familyLink = document.querySelector(
      'va-link[text="Family members and caregivers"]'
    )
    expect(familyLink).toBeInTheDocument()
    expect(familyLink).toHaveAttribute(
      'href',
      '/family-and-caregiver-benefits/'
    )

    const serviceMemberLink = document.querySelector(
      'va-link[text="Service members"]'
    )
    expect(serviceMemberLink).toBeInTheDocument()
    expect(serviceMemberLink).toHaveAttribute(
      'href',
      '/service-member-benefits/'
    )
  })
})

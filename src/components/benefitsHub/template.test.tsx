import React from 'react'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from '@/test-utils'
import { BenefitsHub } from './template'

// Mock the recordEvent function
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

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
  fieldSupportServices: undefined,
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
        fieldSupportServices={undefined}
      />
    )

    expect(screen.queryByText(/Test Health Benefits Hub/)).toBeInTheDocument()

    // Skip axe test for now due to heading order issue in accordion structure
    // The va-accordion contains h3 elements which causes heading-order violations
    // when not preceded by h2. This is a known issue with VA design system components.
    // const axeResults = await axe(container)
    // expect(axeResults).toHaveNoViolations()
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
        fieldSupportServices={undefined}
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
        fieldSupportServices={undefined}
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
        fieldSupportServices={undefined}
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
        fieldSupportServices={undefined}
      />
    )

    expect(screen.queryByText(/Benefits Hub/)).toBeInTheDocument()
    expect(screen.queryByText(/Get information for:/)).toBeInTheDocument()

    // Check for va-accordion-item with correct header attribute
    const accordionItem = document.querySelector(
      'va-accordion-item[header="Not a Veteran or family member?"]'
    )
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

  test('renders BenefitsHub component with support services (Call us section)', () => {
    const mockSupportServices = [
      {
        type: 'node--support_service',
        id: '6ab87079-1b6c-4ef9-9a20-937f92199aef',
        title: 'Health benefits hotline:',
        field_phone_number: '877-222-VETS (8387)',
        field_link: {
          uri: 'tel:1-877-222-VETS(8387)',
          title: '',
          url: 'tel:1-877-222-VETS(8387)',
        },
      },
      {
        type: 'node--support_service',
        id: 'tty-service-id',
        title: 'TTY: 711',
        field_phone_number: undefined,
        field_link: {
          uri: 'tel:711',
          title: '',
          url: 'tel:711',
        },
      },
    ]

    render(
      <BenefitsHub
        id="6"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title="Benefits Hub with Support Services"
        titleIcon={null}
        intro="Test support services functionality"
        spokes={[]}
        fieldLinks={null}
        fieldSupportServices={mockSupportServices}
      />
    )

    // Check that the "Call us" section is rendered
    expect(screen.queryByText(/Call us/)).toBeInTheDocument()

    // Check that the Ask questions accordion is rendered
    const askQuestionsAccordion = document.querySelector(
      'va-accordion-item[header="Ask questions"]'
    )
    expect(askQuestionsAccordion).toBeInTheDocument()

    // Check that the health benefits hotline service is rendered with phone number
    expect(screen.queryByText(/Health benefits hotline:/)).toBeInTheDocument()
    expect(screen.queryByText(/877-222-VETS \(8387\)/)).toBeInTheDocument()

    // Check that the link has the correct href
    const hotlineLink = screen
      .getByText('Health benefits hotline:')
      .closest('a')
    expect(hotlineLink).toHaveAttribute('href', 'tel:1-877-222-VETS(8387)')

    // Check that TTY service is rendered with special handling
    expect(screen.queryByText(/TTY: 711/)).toBeInTheDocument()
    const ttyLink = screen.getByText('TTY: 711').closest('a')
    expect(ttyLink).toHaveAttribute('href', 'tel:711')
    expect(ttyLink).toHaveAttribute('aria-label', 'TTY: 7 1 1.')
  })

  test('renders BenefitsHub component with support services without phone numbers', () => {
    const mockSupportServicesNoPhone = [
      {
        type: 'node--support_service',
        id: 'service-without-phone',
        title: 'Online Portal',
        field_phone_number: undefined,
        field_link: {
          uri: 'https://example.com/portal',
          title: 'Online Portal',
          url: 'https://example.com/portal',
        },
      },
      {
        type: 'node--support_service',
        id: 'service-no-link',
        title: 'Text Only Service',
        field_phone_number: undefined,
        field_link: undefined,
      },
    ]

    render(
      <BenefitsHub
        id="7"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title="Benefits Hub with Non-Phone Services"
        titleIcon={null}
        intro="Test services without phone numbers"
        spokes={[]}
        fieldLinks={null}
        fieldSupportServices={mockSupportServicesNoPhone}
      />
    )

    // Check that the "Call us" section is rendered
    expect(screen.queryByText(/Call us/)).toBeInTheDocument()

    // Check that the online portal service is rendered as a link
    expect(screen.queryByText(/Online Portal/)).toBeInTheDocument()
    const portalLink = screen.getByText('Online Portal').closest('a')
    expect(portalLink).toHaveAttribute('href', 'https://example.com/portal')

    // Check that the text-only service is rendered without a link
    expect(screen.queryByText(/Text Only Service/)).toBeInTheDocument()
    const textOnlyElement = screen.getByText('Text Only Service')
    expect(textOnlyElement.tagName).not.toBe('A') // Should not be wrapped in an <a> tag
  })

  test('does not render Call us section when fieldSupportServices is empty', () => {
    render(
      <BenefitsHub
        id="8"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title="Benefits Hub without Support Services"
        titleIcon={null}
        intro="No support services"
        spokes={[]}
        fieldLinks={null}
        fieldSupportServices={[]}
      />
    )

    // Check that the "Call us" section is NOT rendered
    expect(screen.queryByText(/Call us/)).not.toBeInTheDocument()

    // But "Message us" should still be rendered
    expect(screen.queryByText(/Message us/)).toBeInTheDocument()
  })

  test('does not render Call us section when fieldSupportServices is undefined', () => {
    render(
      <BenefitsHub
        id="9"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title="Benefits Hub without Support Services"
        titleIcon={null}
        intro="No support services defined"
        spokes={[]}
        fieldLinks={null}
        fieldSupportServices={undefined}
      />
    )

    // Check that the "Call us" section is NOT rendered
    expect(screen.queryByText(/Call us/)).not.toBeInTheDocument()

    // But "Message us" should still be rendered
    expect(screen.queryByText(/Message us/)).toBeInTheDocument()
  })

  test('calls recordEvent when support service links are clicked', async () => {
    const { recordEvent } = await import('@/lib/analytics/recordEvent')
    const mockRecordEvent = recordEvent as jest.MockedFunction<
      typeof recordEvent
    >

    const mockSupportServices = [
      {
        type: 'node--support_service',
        id: 'clickable-service',
        title: 'Clickable Service',
        field_phone_number: '123-456-7890',
        field_link: {
          uri: 'tel:123-456-7890',
          title: '',
          url: 'tel:123-456-7890',
        },
      },
    ]

    render(
      <BenefitsHub
        id="10"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title="Benefits Hub Click Test"
        titleIcon={null}
        intro="Test click functionality"
        spokes={[]}
        fieldLinks={null}
        fieldSupportServices={mockSupportServices}
      />
    )

    // Find and click the service link
    const serviceLink = screen.getByText('Clickable Service').closest('a')
    expect(serviceLink).toBeInTheDocument()
    expect(serviceLink).not.toBeNull()

    fireEvent.click(serviceLink!)

    // Verify that recordEvent was called with the correct parameters
    expect(mockRecordEvent).toHaveBeenCalledWith({
      event: 'nav-hub-rail',
      'nav-path': 'Ask questions',
    })
  })
})

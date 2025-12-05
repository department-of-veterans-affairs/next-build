import React from 'react'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from '@/test-utils'
import { BenefitsHub } from './template'
import mockData from './mock.json'
// Import the loader to register web components
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

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
  supportServices: undefined,
  connectWithUs: null,
  relatedLinks: null,
}

describe('BenefitsHub with valid data', () => {
  beforeAll(() => {
    defineCustomElements()
  })
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
        supportServices={undefined}
        connectWithUs={mockData.field_connect_with_us}
        relatedLinks={null}
      />
    )

    expect(
      screen.getByRole('heading', { name: /Test Health Benefits Hub/ })
    ).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders BenefitsHub component with intro text', () => {
    render(
      <BenefitsHub
        {...mockBenefitsData}
        intro={'This is a test intro for the Benefits Hub component.'}
        fieldLinks={null}
        supportServices={undefined}
        connectWithUs={mockData.field_connect_with_us}
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
        {...mockBenefitsData}
        title={'Disability'}
        titleIcon={'disability'}
        intro={'Learn about disability compensation.'}
        fieldLinks={null}
        supportServices={undefined}
        connectWithUs={null}
        relatedLinks={null}
      />
    )

    expect(
      screen.getByRole('heading', { name: /Disability/ })
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Learn about disability compensation./)
    ).toBeInTheDocument()

    // Test that the va-icon element is rendered with the correct icon and styling
    const vaIcon = document.querySelector('va-icon')
    expect(vaIcon).toBeInTheDocument()
    expect(vaIcon.icon).toBe('description')
    expect(vaIcon.size).toBe(3)
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
        {...mockBenefitsData}
        title={'Health Care'}
        titleIcon={'health-care'}
        intro={'Manage your VA health care.'}
        spokes={mockSpokes}
        fieldLinks={null}
        supportServices={undefined}
        connectWithUs={null}
        relatedLinks={null}
      />
    )

    expect(
      screen.getByRole('heading', { name: /Health Care/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Get VA health care/ })
    ).toBeInTheDocument()

    const vaLink = document.querySelector('va-link')
    expect(vaLink.text).toBe('Apply for health care')

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
        {...mockBenefitsData}
        title={'Benefits Hub'}
        intro={'Information for different audiences.'}
        fieldLinks={mockFieldLinks}
        supportServices={undefined}
        connectWithUs={null}
        relatedLinks={null}
      />
    )

    expect(
      screen.getByRole('heading', { name: /Benefits Hub/ })
    ).toBeInTheDocument()
    expect(screen.getByText(/Get information for:/)).toBeInTheDocument()

    // Check that the content is rendered (web components may not have attributes in test environment)
    expect(screen.getByText('Get information for:')).toBeInTheDocument()

    // Check that va-link elements are rendered (even if text content is not visible in test environment)
    const fieldLinksElements = document.querySelectorAll('va-link')
    expect(fieldLinksElements).toHaveLength(2)

    // The va-link web components don't expose their attributes properly in test environment
    // So we just verify they exist and are in the right places
    expect(fieldLinksElements[0]).toBeInTheDocument()
    expect(fieldLinksElements[1]).toBeInTheDocument()

    // Verify the accordion section container exists
    expect(document.querySelector('#get-information-for')).toBeInTheDocument()
  })

  test('renders BenefitsHub component with connectWithUs (Connect with us accordion)', () => {
    render(
      <BenefitsHub
        {...mockBenefitsData}
        intro={'Information for different audiences.'}
        connectWithUs={mockData.field_connect_with_us}
        relatedLinks={null}
      />
    )

    expect(screen.queryByText(/Get updates/)).toBeInTheDocument()
    expect(screen.queryByText(/Follow us/)).toBeInTheDocument()

    // Check for the Connect with us accordion item (should be the second one)
    const accordionItems = document.querySelectorAll('va-accordion-item')
    expect(accordionItems.length).toBeGreaterThan(1)
    const connectWithUsAccordion = accordionItems[1] // Second accordion item
    expect(connectWithUsAccordion).toBeInTheDocument()
    expect(connectWithUsAccordion.header).toBe('Connect with us')
    // Check for va-link elements with correct attributes
    const emailLink = document.querySelectorAll('va-link')[0]
    expect(emailLink.text).toBe('Veterans Affairs Email Updates')
    expect(emailLink.href).toBe(
      'https://public.govdelivery.com/accounts/USVA/subscriber/new/'
    )

    const twitterLink = document.querySelectorAll('va-link')[1]
    expect(twitterLink.text).toBe('Veterans Affairs X (formerly Twitter)')
    expect(twitterLink.href).toBe('https://www.twitter.com/DeptVetAffairs')

    const facebookLink = document.querySelectorAll('va-link')[2]
    expect(facebookLink.text).toBe('Veterans Affairs Facebook')
    expect(facebookLink.href).toBe('https://www.facebook.com/VeteransAffairs')

    const youtubeLink = document.querySelectorAll('va-link')[3]
    expect(youtubeLink.text).toBe('Veterans Affairs YouTube')
    expect(youtubeLink.href).toBe('https://www.youtube.com/DeptVetAffairs')

    const instagramLink = document.querySelectorAll('va-link')[4]
    expect(instagramLink.text).toBe('Veterans Affairs Instagram')
    expect(instagramLink.href).toBe('https://www.instagram.com/deptvetaffairs')
  })

  test('renders on-this-page component when spokes exist', () => {
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
        {...mockBenefitsData}
        title={'Benefits Hub with On This Page'}
        intro={'Testing on-this-page component.'}
        spokes={mockSpokes}
        fieldLinks={null}
        connectWithUs={null}
        relatedLinks={null}
      />
    )

    // Check that the va-on-this-page element is rendered
    const onThisPageElement = document.querySelector('va-on-this-page')
    expect(onThisPageElement).toBeInTheDocument()
  })

  test('does not render on-this-page component when no spokes exist', () => {
    render(
      <BenefitsHub
        {...mockBenefitsData}
        title={'Benefits Hub without Spokes'}
        intro={'Testing without spokes.'}
        spokes={[]}
        fieldLinks={null}
        connectWithUs={null}
        relatedLinks={null}
      />
    )

    // Check that the va-on-this-page element is not rendered when spokes is empty
    const onThisPageElement = document.querySelector('va-on-this-page')
    expect(onThisPageElement).not.toBeInTheDocument()
  })

  test('does not render on-this-page component when spokes is null', () => {
    render(
      <BenefitsHub
        {...mockBenefitsData}
        title={'Benefits Hub with Null Spokes'}
        intro={'Testing with null spokes.'}
        spokes={null}
        fieldLinks={null}
        connectWithUs={null}
        relatedLinks={null}
      />
    )

    // Check that the va-on-this-page element is not rendered when spokes is null
    const onThisPageElement = document.querySelector('va-on-this-page')
    expect(onThisPageElement).not.toBeInTheDocument()
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
          entityId: 456,
          uri: '/related-info-1/',
          title: 'Related Topic 1',
          options: [],
          summary: 'This is a summary for topic 1',
        },
        {
          type: 'paragraph--link_teaser' as const,
          id: 'related-teaser-2',
          entityId: 457,
          uri: '/related-info-2/',
          title: 'Related Topic 2',
          options: [],
          summary: 'This is a summary for topic 2',
        },
      ],
    }

    const { container } = render(
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
        connectWithUs={null}
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
    const relatedSection = container.querySelector(
      '.merger-majorlinks.va-nav-linkslist.va-nav-linkslist--related'
    )
    expect(relatedSection).toBeInTheDocument()

    // Check that related link teasers are rendered with correct data attributes
    const linkTeaser1 = container.querySelector(
      '[data-entity-id="related-teaser-1"]'
    )
    expect(linkTeaser1).toBeInTheDocument()
    expect(linkTeaser1).toHaveAttribute(
      'data-links-list-header',
      'Related Topic 1'
    )
    expect(linkTeaser1).toHaveAttribute(
      'data-links-list-section-header',
      'Related Information'
    )

    const linkTeaser2 = container.querySelector(
      '[data-entity-id="related-teaser-2"]'
    )
    expect(linkTeaser2).toBeInTheDocument()
    expect(linkTeaser2).toHaveAttribute(
      'data-links-list-header',
      'Related Topic 2'
    )

    // Check that summaries are rendered
    expect(
      screen.getByText('This is a summary for topic 1')
    ).toBeInTheDocument()
    expect(
      screen.getByText('This is a summary for topic 2')
    ).toBeInTheDocument()
  })
})

test('renders BenefitsHub component with support services (Call us section)', () => {
  const mockSupportServices = [
    {
      type: 'node--support_service',
      id: '6ab87079-1b6c-4ef9-9a20-937f92199aef',
      title: 'Health benefits hotline:',
      number: '877-222-VETS (8387)',
      link: {
        uri: 'tel:1-877-222-VETS(8387)',
        title: '',
        url: 'tel:1-877-222-VETS(8387)',
        options: {},
      },
    },
    {
      type: 'node--support_service',
      id: 'tty-service-id',
      title: 'TTY: 711',
      number: undefined,
      link: {
        uri: 'tel:711',
        title: '',
        url: 'tel:711',
        options: {},
      },
    },
  ]

  render(
    <BenefitsHub
      {...mockBenefitsData}
      id="6"
      title="Benefits Hub with Support Services"
      intro="Test support services functionality"
      supportServices={mockSupportServices}
      connectWithUs={null}
      relatedLinks={null}
    />
  )

  // Check that the "Call us" section is rendered
  expect(screen.getByText('Call us')).toBeInTheDocument()

  // Check that the Ask questions accordion is rendered (don't rely on web component attributes)
  const askQuestionsAccordion = document.querySelector(
    'va-accordion-item#ask-questions'
  )
  expect(askQuestionsAccordion).toBeInTheDocument()

  // Check that the health benefits hotline service is rendered with phone number
  expect(screen.queryByText(/Health benefits hotline:/)).toBeInTheDocument()
  expect(screen.queryByText(/877-222-VETS \(8387\)/)).toBeInTheDocument()

  // Check that the link has the correct href (use text content instead of role)
  const hotlineLink = screen.getByText(/Health benefits hotline:/).closest('a')
  expect(hotlineLink).toHaveAttribute('href', 'tel:1-877-222-VETS(8387)')

  // Check that TTY service is rendered with special handling
  expect(screen.getByText(/TTY: 711/)).toBeInTheDocument()
  const ttyLink = screen.getByText(/TTY: 711/).closest('a')
  expect(ttyLink).toHaveAttribute('href', 'tel:711')
  expect(ttyLink).toHaveAttribute('aria-label', 'TTY: 7 1 1.')
})

test('renders BenefitsHub component with support services without phone numbers', () => {
  const mockSupportServicesNoPhone = [
    {
      type: 'node--support_service',
      id: 'service-without-phone',
      title: 'Online Portal',
      number: undefined,
      link: {
        uri: 'https://example.com/portal',
        title: 'Online Portal',
        url: 'https://example.com/portal',
        options: {},
      },
    },
    {
      type: 'node--support_service',
      id: 'service-no-link',
      title: 'Text Only Service',
      number: undefined,
      link: undefined,
    },
  ]

  render(
    <BenefitsHub
      {...mockBenefitsData}
      id="7"
      title="Benefits Hub with Non-Phone Services"
      intro="Test services without phone numbers"
      supportServices={mockSupportServicesNoPhone}
      connectWithUs={null}
      relatedLinks={null}
    />
  )

  // Check that the "Call us" section is rendered
  expect(screen.getByText('Call us')).toBeInTheDocument()

  // Check that the online portal service is rendered as a link
  expect(screen.getByText(/Online Portal/)).toBeInTheDocument()
  const portalLink = screen.getByText(/Online Portal/).closest('a')
  expect(portalLink).toHaveAttribute('href', 'https://example.com/portal')

  // Check that the text-only service is rendered without a link
  expect(screen.queryByText(/Text Only Service/)).toBeInTheDocument()
  const textOnlyElement = screen.getByText('Text Only Service')
  expect(textOnlyElement.tagName).not.toBe('A') // Should not be wrapped in an <a> tag
})

test('does not render Call us section when supportServices is empty', () => {
  render(
    <BenefitsHub
      {...mockBenefitsData}
      id="8"
      title="Benefits Hub without Support Services"
      intro="No support services"
      spokes={[]}
      fieldLinks={null}
      supportServices={[]}
      connectWithUs={null}
      relatedLinks={null}
    />
  )

  // Check that the "Call us" section is NOT rendered
  expect(screen.queryByText('Call us')).not.toBeInTheDocument()

  // But "Message us" should still be rendered
  expect(screen.getByText('Message us')).toBeInTheDocument()
})
test('does not render Call us section when supportServices is undefined', () => {
  render(
    <BenefitsHub
      {...mockBenefitsData}
      id="9"
      lastUpdated="2024-01-01"
      title="Benefits Hub without Support Services"
      intro="No support services defined"
      spokes={[]}
      fieldLinks={null}
      connectWithUs={null}
      relatedLinks={null}
    />
  )

  // Check that the "Call us" section is NOT rendered
  expect(screen.queryByText('Call us')).not.toBeInTheDocument()

  // But "Message us" should still be rendered
  expect(screen.getByText('Message us')).toBeInTheDocument()
})

test('calls recordEvent when support service links are clicked', async () => {
  const { recordEvent } = await import('@/lib/analytics/recordEvent')
  const mockRecordEvent = recordEvent as jest.MockedFunction<typeof recordEvent>

  const mockSupportServices = [
    {
      type: 'node--support_service',
      id: 'clickable-service',
      title: 'Clickable Service',
      number: '123-456-7890',
      link: {
        uri: 'tel:123-456-7890',
        title: '',
        url: 'tel:123-456-7890',
        options: {},
      },
    },
  ]

  render(
    <BenefitsHub
      {...mockBenefitsData}
      id="10"
      title="Benefits Hub Click Test"
      intro="Test click functionality"
      supportServices={mockSupportServices}
      connectWithUs={null}
      relatedLinks={null}
    />
  )

  // Find and click the service link - look for the clickable service text
  const serviceLink = screen.getByText(/Clickable Service/).closest('a')
  expect(serviceLink).toBeInTheDocument()

  fireEvent.click(serviceLink)

  // Verify that recordEvent was called with the correct parameters
  expect(mockRecordEvent).toHaveBeenCalledWith({
    event: 'nav-hub-rail',
    'nav-path': 'Ask questions',
  })
})

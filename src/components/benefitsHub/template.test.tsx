import React from 'react'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { BenefitsHub } from './template'
import mockData from './mock.json'
// Import the loader to register web components
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

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
  connectWithUs: null,
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
        connectWithUs={mockData.field_connect_with_us}
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
        connectWithUs={mockData.field_connect_with_us}
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
        connectWithUs={null}
      />
    )

    expect(screen.queryByText(/Disability/)).toBeInTheDocument()
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
        id="4"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Health Care'}
        titleIcon={'health-care'}
        intro={'Manage your VA health care.'}
        spokes={mockSpokes}
        fieldLinks={null}
        connectWithUs={null}
      />
    )

    expect(screen.queryByText(/Health Care/)).toBeInTheDocument()
    expect(screen.queryByText(/Get VA health care/)).toBeInTheDocument()

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
        id="5"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Benefits Hub'}
        titleIcon={null}
        intro={'Information for different audiences.'}
        spokes={[]}
        fieldLinks={mockFieldLinks}
        connectWithUs={null}
      />
    )

    expect(screen.queryByText(/Benefits Hub/)).toBeInTheDocument()
    expect(screen.queryByText(/Get information for:/)).toBeInTheDocument()

    // Check for va-accordion-item with correct header attribute
    const accordionItem = document.querySelector('va-accordion-item')
    expect(accordionItem).toBeInTheDocument()
    expect(accordionItem.header).toBe('Not a Veteran or family member?')

    // Check for va-link elements with correct attributes
    const familyLink = document.querySelectorAll('va-link')[0]
    expect(familyLink.text).toBe('Family members and caregivers')
    expect(familyLink.href).toBe('/family-and-caregiver-benefits/')

    const serviceMemberLink = document.querySelectorAll('va-link')[1]
    expect(serviceMemberLink.text).toBe('Service members')
    expect(serviceMemberLink.href).toBe('/service-member-benefits/')
  })

  test('renders BenefitsHub component with connectWithUs (Connect with us accordion)', () => {
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
        fieldLinks={null}
        connectWithUs={mockData.field_connect_with_us}
      />
    )

    expect(screen.queryByText(/Get updates/)).toBeInTheDocument()
    expect(screen.queryByText(/Follow us/)).toBeInTheDocument()

    // Check for va-accordion-item with correct header attribute
    const accordionItem = document.querySelector('va-accordion-item')
    expect(accordionItem).toBeInTheDocument()
    expect(accordionItem.header).toBe('Connect with us')
    const mockEmailValue =
      'https://public.govdelivery.com/accounts/USVA/subscriber/new/'
    // Check for va-link elements with correct attributes
    const emailLink = document.querySelectorAll('va-link')[0]
    expect(emailLink.text).toBe('Veterans Affairs Email Updates')
    expect(emailLink.href).toBe(mockEmailValue)

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
})

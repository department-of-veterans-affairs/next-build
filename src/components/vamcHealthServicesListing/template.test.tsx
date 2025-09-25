import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcHealthServicesListing } from './template'

// Mock menu data for testing
const mockMenu = {
  rootPath: '/test-facility/',
  data: {
    name: 'Test Facility',
    description: '',
    links: [],
  },
}

// Mock featured content data for testing
const mockFeaturedContent = [
  {
    id: 'test-1',
    type: 'paragraph--link_teaser' as const,
    title: 'Mental health at VA Black Hills health care',
    summary: 'Learn about our leading clinical mental health work',
    uri: '/mental-health',
    parentField: 'field_featured_content_healthser',
    entityId: 1,
    options: [],
    componentParams: {
      sectionHeader: '',
    },
  },
  {
    id: 'test-2',
    type: 'paragraph--link_teaser' as const,
    title: 'Health care for LGBTQ+ Veterans',
    summary:
      'VA Black Hills health care provides compassionate care for LGBTQ+ Veterans',
    uri: '/lgbtq-care',
    parentField: 'field_featured_content_healthser',
    entityId: 2,
    options: [],
    componentParams: {
      sectionHeader: '',
    },
  },
]

// Mock health service groups data for testing
const mockHealthServiceGroups = [
  {
    typeOfCare: 'Primary care',
    services: [
      {
        id: '1',
        title: 'Primary Care Service',
        alsoKnownAs: 'Test Service',
        commonlyTreatedCondition: 'Test condition',
        descriptionHtml: 'Primary care description',
        bodyHtml: '<p>Test body content</p>',
        typeOfCare: 'Primary care',
        locations: [],
      },
    ],
  },
  {
    typeOfCare: 'Mental health care',
    services: [
      {
        id: '2',
        title: 'Mental Health Service',
        alsoKnownAs: 'Test Service',
        commonlyTreatedCondition: 'Test condition',
        descriptionHtml: 'Mental health description',
        bodyHtml: '<p>Test body content</p>',
        typeOfCare: 'Mental health care',
        locations: [],
      },
    ],
  },
  {
    typeOfCare: 'Specialty care',
    services: [
      {
        id: '3',
        title: 'Specialty Service',
        alsoKnownAs: 'Test Service',
        commonlyTreatedCondition: 'Test condition',
        descriptionHtml: 'Specialty care description',
        bodyHtml: '<p>Test body content</p>',
        typeOfCare: 'Specialty care',
        locations: [],
      },
    ],
  },
  {
    typeOfCare: 'Social programs and services',
    services: [
      {
        id: '4',
        title: 'Social Service',
        alsoKnownAs: 'Test Service',
        commonlyTreatedCondition: 'Test condition',
        descriptionHtml: 'Social service description',
        bodyHtml: '<p>Test body content</p>',
        typeOfCare: 'Social programs and services',
        locations: [],
      },
    ],
  },
  {
    typeOfCare: 'Other services',
    services: [
      {
        id: '5',
        title: 'Other Service',
        alsoKnownAs: 'Test Service',
        commonlyTreatedCondition: 'Test condition',
        descriptionHtml: 'Other service description',
        bodyHtml: '<p>Test body content</p>',
        typeOfCare: 'Other services',
        locations: [],
      },
    ],
  },
]

const defaultProps = {
  title: 'Health services',
  introText: 'Test intro',
  systemTitle: 'Test system title',
  path: '/test-facility/health-services',
  administration: null,
  vamcEhrSystem: null,
  menu: mockMenu,
  featuredContent: mockFeaturedContent,
  healthServiceGroups: mockHealthServiceGroups,
  id: 'test-id',
  type: 'node--health_services_listing',
  published: true,
  lastUpdated: '2023-01-01',
}

describe('VamcHealthServicesListing with valid data', () => {
  test('renders title', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)
    expect(screen.getByText('Health services')).toBeInTheDocument()
  })

  test('renders intro text when provided', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)
    expect(screen.getByText('Test intro')).toBeInTheDocument()
  })

  test('renders Top Task links when path is provided', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)

    // Check that the Top Task links are visible using the same approach as locationsListing
    const makeAppointmentLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'Make an appointment'
    )
    const registerLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'Register for care'
    )
    const pharmacyLink = screen.getByText(
      (_: string, el: Element | null) =>
        el?.getAttribute('text') === 'Learn about pharmacy services'
    )

    expect(makeAppointmentLink).toBeInTheDocument()
    expect(registerLink).toBeInTheDocument()
    expect(pharmacyLink).toBeInTheDocument()
  })

  test('renders section headings correctly', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)

    expect(screen.getByText('In the spotlight')).toBeInTheDocument()
    expect(screen.getByText('Primary care')).toBeInTheDocument()
    expect(screen.getByText('Mental health care')).toBeInTheDocument()
    expect(screen.getByText('Specialty care')).toBeInTheDocument()
    expect(screen.getByText('Social programs and services')).toBeInTheDocument()
    expect(screen.getByText('Other services')).toBeInTheDocument()
  })

  test('renders lovell switcher when lovell props are provided', () => {
    render(
      <VamcHealthServicesListing
        {...defaultProps}
        lovellVariant={'va'}
        lovellSwitchPath={'/lovell-facility/health-services'}
      />
    )
    expect(
      screen.getByText('You are viewing this page as a VA beneficiary.')
    ).toBeInTheDocument()
  })

  test('renders the sidebar nav with correct attributes', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)
    const nav = screen.getByLabelText('secondary')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('data-widget-type', 'side-nav')
  })

  test('renders featured content when provided', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)
    expect(screen.getByText('In the spotlight')).toBeInTheDocument()
  })

  test('renders health service groups', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)

    // Check that health service group headings are rendered
    expect(screen.getByText('Primary care')).toBeInTheDocument()
    expect(screen.getByText('Mental health care')).toBeInTheDocument()
    expect(screen.getByText('Specialty care')).toBeInTheDocument()
    expect(screen.getByText('Social programs and services')).toBeInTheDocument()
    expect(screen.getByText('Other services')).toBeInTheDocument()

    // Check that service titles are rendered
    expect(screen.getByText('Primary Care Service')).toBeInTheDocument()
    expect(screen.getByText('Mental Health Service')).toBeInTheDocument()
    expect(screen.getByText('Specialty Service')).toBeInTheDocument()
    expect(screen.getByText('Social Service')).toBeInTheDocument()
    expect(screen.getByText('Other Service')).toBeInTheDocument()
  })

  test('renders empty state when no health service groups provided', () => {
    render(
      <VamcHealthServicesListing {...defaultProps} healthServiceGroups={[]} />
    )

    // Check that the empty state message is rendered
    expect(
      screen.getByText('No health services at this time.')
    ).toBeInTheDocument()
  })

  test('renders health service items', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)

    // Check that accordion headers are rendered
    expect(screen.getByText('Primary Care Service')).toBeInTheDocument()
    expect(screen.getByText('Mental Health Service')).toBeInTheDocument()
    expect(screen.getByText('Specialty Service')).toBeInTheDocument()
    expect(screen.getByText('Social Service')).toBeInTheDocument()
    expect(screen.getByText('Other Service')).toBeInTheDocument()

    // Check that accordion content is rendered
    expect(screen.getByText('Primary care description')).toBeInTheDocument()
    expect(screen.getByText('Mental health description')).toBeInTheDocument()
    expect(screen.getByText('Specialty care description')).toBeInTheDocument()
    expect(screen.getByText('Social service description')).toBeInTheDocument()
    expect(screen.getByText('Other service description')).toBeInTheDocument()
  })

  test('renders the system title inside the service content', () => {
    render(<VamcHealthServicesListing {...defaultProps} />)
    expect(
      screen.getAllByRole('heading', {
        name: /Care we provide at.*Test system title/,
      }).length
    ).toBe(5)
  })
})

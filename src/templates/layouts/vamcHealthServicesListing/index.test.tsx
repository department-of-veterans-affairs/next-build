import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcHealthServicesListing } from './index'

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
    type: 'paragraph--link_teaser',
    title: 'Mental health at VA Black Hills health care',
    summary: 'Learn about our leading clinical mental health work',
    uri: '/mental-health',
    parentField: 'field_featured_content_healthser',
  },
  {
    id: 'test-2',
    type: 'paragraph--link_teaser',
    title: 'Health care for LGBTQ+ Veterans',
    summary:
      'VA Black Hills health care provides compassionate care for LGBTQ+ Veterans',
    uri: '/lgbtq-care',
    parentField: 'field_featured_content_healthser',
  },
]

describe('VamcHealthServicesListing with valid data', () => {
  test('renders VamcHealthServicesListing component', () => {
    render(
      <VamcHealthServicesListing
        title={'Health services'}
        introText={'Test intro'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        featuredContent={mockFeaturedContent}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('Health services')).toBeInTheDocument()
  })

  test('renders intro text when provided', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        featuredContent={mockFeaturedContent}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    expect(screen.getByText('This is intro text')).toBeInTheDocument()
  })

  test('renders Top Task links when path is provided', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/boston-health-care/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

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
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        featuredContent={mockFeaturedContent}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

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
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
        lovellVariant={'va'}
        lovellSwitchPath={'/lovell-facility/health-services'}
      />
    )
    expect(
      screen.getByText('You are viewing this page as a VA beneficiary.')
    ).toBeInTheDocument()
  })

  test('renders the sidebar nav with correct attributes', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )
    const nav = screen.getByLabelText('secondary')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('data-widget-type', 'side-nav')
  })

  test('renders featured content when provided', () => {
    render(
      <VamcHealthServicesListing
        title={'Health Services'}
        introText={'This is intro text'}
        path={'/test-facility/health-services'}
        administration={null}
        vamcEhrSystem={null}
        menu={mockMenu}
        featuredContent={mockFeaturedContent}
        id={'test-id'}
        type={'node--health_services_listing'}
        published={true}
        lastUpdated={'2023-01-01'}
      />
    )

    // Check that the featured content section is rendered
    expect(screen.getByText('In the spotlight')).toBeInTheDocument()
  })
})

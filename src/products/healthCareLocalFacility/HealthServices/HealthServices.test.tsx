import React, { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { HealthServices } from './HealthServices'
import { FormattedVAMCFacilityHealthService } from '@/products/healthCareLocalFacility/formatted-type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'
import { PhoneNumber as PhoneNumberType } from '@/types/formatted/phoneNumber'

// Mock ServiceLocation to simplify tests
jest.mock('@/templates/components/serviceLocation/ServiceLocation', () => ({
  ServiceLocation: jest.fn(() => <div>Mock ServiceLocation</div>),
}))

describe('HealthServices', () => {
  const mockHealthServices: FormattedVAMCFacilityHealthService[] = [
    {
      name: 'Primary Care',
      fieldAlsoKnownAs: 'General Medicine',
      fieldCommonlyTreatedCondition: 'Diabetes, Hypertension',
      description: '<p>Comprehensive primary care services</p>',
      entityId: 1,
      entityBundle: 'health_care_service',
      locations: [
        {
          // We're mocking out the service location component, so we don't
          // need to provide a full address object.
          // NOTE: This is relying on static typing to test for the proper
          // integration.
          fieldServiceLocationAddress: {} as ParagraphServiceLocationAddress,
        },
      ],
      fieldFacilityLocatorApiId: 'vha_123',
      fieldHealthServiceApiId: 'primary_care',
      localServiceDescription: 'Local primary care description',
    },
    {
      name: 'Mental Health',
      fieldAlsoKnownAs: 'Behavioral Health',
      entityId: 2,
      entityBundle: 'health_care_service',
      locations: [
        {
          fieldServiceLocationAddress: null,
        },
      ],
      fieldBody: '<p>Specialized mental health services</p>',
      localServiceDescription: 'Local mental health description',
    },
    {
      name: 'Dental',
      entityId: 3,
      entityBundle: 'health_care_service',
      locations: [],
      localServiceDescription: 'Local dental description',
    },
  ]

  const baseProps: ComponentProps<typeof HealthServices> = {
    healthServices: mockHealthServices,
    mentalHealthPhoneNumber: {
      number: '555-1234',
      extension: '123',
      phoneType: 'tel',
    } as PhoneNumberType,
    mainPhoneString: '555-5678',
  }

  it('renders section title and description', () => {
    render(<HealthServices {...baseProps} />)

    expect(
      screen.getByRole('heading', {
        name: 'Health services offered here',
        level: 2,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Select a topic to learn more.')
    ).toBeInTheDocument()
  })

  it('renders correct number of accordion items', () => {
    render(<HealthServices {...baseProps} />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('renders service names and subheaders', () => {
    const { container } = render(<HealthServices {...baseProps} />)

    // Service names are rendered as headings of level 3
    expect(
      screen.getByRole('heading', { name: 'Primary Care', level: 3 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Mental Health', level: 3 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Dental', level: 3 })
    ).toBeInTheDocument()

    // Subheaders are rendered as data-childlabel attributes
    expect(
      container.querySelector('[data-childlabel="General Medicine"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-childlabel="Behavioral Health"]')
    ).toBeInTheDocument()
  })

  it('renders common conditions when present', () => {
    render(<HealthServices {...baseProps} />)
    expect(
      screen.getByText('Common conditions: Diabetes, Hypertension')
    ).toBeInTheDocument()
  })

  it('does not render common conditions when they are not present', () => {
    const mockServiceWithoutConditions: FormattedVAMCFacilityHealthService[] = [
      {
        name: 'Dental',
        entityId: 3,
        entityBundle: 'health_care_service',
        locations: [],
        localServiceDescription: 'Local dental description',
      },
    ]

    render(
      <HealthServices
        {...baseProps}
        healthServices={mockServiceWithoutConditions}
      />
    )

    // The common conditions text should not be present
    expect(screen.queryByText(/Common conditions:/)).not.toBeInTheDocument()
  })

  it('renders service descriptions', () => {
    render(<HealthServices {...baseProps} />)
    expect(
      screen.getByText('Comprehensive primary care services')
    ).toBeInTheDocument()
  })

  it('renders ServiceLocation only when address data exists', () => {
    render(<HealthServices {...baseProps} />)
    expect(screen.getAllByText('Mock ServiceLocation')).toHaveLength(1)
  })

  it('renders local description when no location data', () => {
    render(<HealthServices {...baseProps} />)
    expect(
      screen.queryByText('Local primary care description')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('Local mental health description')
    ).toBeInTheDocument()
    expect(screen.getByText('Local dental description')).toBeInTheDocument()
  })

  it('renders wait times widget for VHA facilities', () => {
    render(<HealthServices {...baseProps} />)

    const widget = document.querySelector(
      'div[data-widget-type="facility-appointment-wait-times-widget"]'
    )

    expect(widget).toBeInTheDocument()
    expect(widget).toHaveAttribute('data-facility', 'vha_123')
    expect(widget).toHaveAttribute('data-service', 'primary_care')
  })

  it('renders additional body content', () => {
    render(<HealthServices {...baseProps} />)
    expect(
      screen.getByText('Specialized mental health services')
    ).toBeInTheDocument()
  })
})

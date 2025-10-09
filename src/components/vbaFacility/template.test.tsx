import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { VbaFacility } from './template'
import mockData from '@/components/vbaFacility/mock.json'
import mockServiceData from './vbaFacilityService.mock.json'
import { formatter } from './query'
import { NodeVbaFacility, NodeVbaService } from '@/types/drupal/node'

describe('VbaFacility with valid data', () => {
  const mockWithService = {
    entity: mockData as NodeVbaFacility,
    services: [
      { ...(mockServiceData as NodeVbaService), field_office: mockData },
    ],
  }
  const formattedMockData = formatter(mockWithService)
  test('renders VbaFacility component', async () => {
    const { container } = render(<VbaFacility {...formattedMockData} />)

    expect(
      screen.queryByText(
        /Togus VA Regional Benefit Office at Togus VA Medical Center/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /We help Veterans, service members, and their families access VA benefits and services./
      )
    ).toBeInTheDocument()
    expect(screen.queryByText(/1 VA Center, Bldg. 248/)).toBeInTheDocument()
    expect(screen.getByTestId('make-appointment-link')).toHaveAttribute(
      'text',
      'Make an appointment'
    )
    expect(screen.getByTestId('make-appointment-link')).toHaveAttribute(
      'href',
      'https://va.my.site.com/VAVERA/s/'
    )
    expect(screen.getByTestId('ask-benefit-question-link')).toHaveAttribute(
      'text',
      'Ask a benefit question'
    )
    expect(screen.getByTestId('ask-benefit-question-link')).toHaveAttribute(
      'href',
      'https://ask.va.gov'
    )
    expect(screen.getByTestId('check-claim-status-link')).toHaveAttribute(
      'text',
      'Check a claim status'
    )
    expect(screen.getByTestId('check-claim-status-link')).toHaveAttribute(
      'href',
      '/claim-or-appeal-status'
    )

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
  test('renders ExpandableOperatingStatus when operating status is provided', () => {
    const testDataWithOperatingStatus = {
      ...formattedMockData,
      operatingStatusFacility: 'limited' as const,
      operatingStatusMoreInfo: 'Limited hours due to maintenance',
    }

    const { container } = render(
      <VbaFacility {...testDataWithOperatingStatus} />
    )

    expect(container.querySelector('va-alert-expandable')).toBeInTheDocument()
    expect(
      screen.getByText('Limited hours due to maintenance')
    ).toBeInTheDocument()
  })
  test('renders the cant find benefits alert', () => {
    render(<VbaFacility {...formattedMockData} />)

    expect(screen.getByTestId('cant-find-benefits-alert')).toBeInTheDocument()
  })
  test('does not render the cant find benefits alert if not in data', () => {
    const dataWithoutCantFindBenefits = {
      ...formattedMockData,
      ccCantFindBenefits: null,
    }
    render(<VbaFacility {...dataWithoutCantFindBenefits} />)

    expect(
      screen.queryByTestId('cant-find-benefits-alert')
    ).not.toBeInTheDocument()
  })
  test('sets required facility data to window object', () => {
    render(<VbaFacility {...formattedMockData} />)
    // @ts-expect-error - window.mainVBAPhone is not a default window property, but we're adding it
    expect(window.mainVBAPhone).toBe(formattedMockData.phoneNumber)
    // @ts-expect-error - window.mainVBAAddress is not a default window property, but we're adding it
    expect(window.mainVBAAddress).toEqual({
      addressLine1: formattedMockData.address.address_line1,
      addressLine2: formattedMockData.address.address_line2 || null,
      administrativeArea: formattedMockData.address.administrative_area,
      countryCode: formattedMockData.address.country_code,
      locality: formattedMockData.address.locality,
      postalCode: formattedMockData.address.postal_code,
    })
    // @ts-expect-error - window.mainVBAFacilityApiId is not a default window property, but we're adding it
    expect(window.mainVBAFacilityApiId).toBe(
      formattedMockData.facilityLocatorApiId
    )
  })
})

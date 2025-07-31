import React from 'react'
import { render, screen } from '@testing-library/react'
import { VbaFacility } from './index'
import mockData from '@/mocks/vbaFacility.mock.json'
import { formatter } from '@/data/queries/vbaFacility'

describe('VbaFacility with valid data', () => {
  const formattedMockData = formatter(mockData)
  test('renders VbaFacility component', () => {
    render(<VbaFacility {...formattedMockData} />)

    expect(
      screen.queryByText(
        /Veteran Readiness and Employment Office at West Palm Beach VA Medical Center/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /We help Veterans, service members, and their families access VA benefits and services./
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/7305 N. Military Trail, Bldg 10/)
    ).toBeInTheDocument()
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
      ccCantFindBenefits: undefined,
    }
    render(<VbaFacility {...dataWithoutCantFindBenefits} />)

    expect(
      screen.queryByTestId('cant-find-benefits-alert')
    ).not.toBeInTheDocument()
  })
})

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
}

describe('BenefitsHub with valid data', () => {
  test('renders BenefitsHub component', async () => {
    const { container } = render(<BenefitsHub {...mockBenefitsData} />)

    expect(screen.queryByText(/Test Health Benefits Hub/)).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders BenefitsHub component with intro text', () => {
    render(<BenefitsHub {...mockBenefitsData} />)

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
        intro={'Learn about disability compensation.'}
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
})

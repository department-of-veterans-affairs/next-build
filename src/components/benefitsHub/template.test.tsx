import React from 'react'
import { render, screen } from '@testing-library/react'
import { BenefitsHub } from './template'

describe('BenefitsHub with valid data', () => {
  test('renders BenefitsHub component with title only', () => {
    render(
      <BenefitsHub
        id="1"
        type=""
        published={true}
        lastUpdated="2024-01-01"
        title={'Hello world'}
        titleIcon={null}
        fieldIntroText={null}
      />
    )

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
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
        fieldIntroText={'This is an intro text for health care benefits.'}
      />
    )

    expect(screen.queryByText(/Health Care/)).toBeInTheDocument()
    expect(
      screen.queryByText(/This is an intro text for health care benefits./)
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
        fieldIntroText={'Learn about disability compensation.'}
      />
    )

    expect(screen.queryByText(/Disability/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Learn about disability compensation./)
    ).toBeInTheDocument()
  })
})

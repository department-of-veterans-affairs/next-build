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
        fieldSpokes={[]}
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
        fieldSpokes={[]}
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
        fieldSpokes={[]}
      />
    )

    expect(screen.queryByText(/Disability/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Learn about disability compensation./)
    ).toBeInTheDocument()
  })

  test('renders BenefitsHub component with spokes', () => {
    const mockSpokes = [
      {
        type: 'paragraph--list_of_link_teasers' as const,
        id: 'spoke-1',
        entityId: 1,
        drupal_internal__id: 1,
        drupal_internal__revision_id: 1,
        langcode: 'en',
        status: true,
        field_title: 'Get VA health care',
        field_va_paragraphs: [
          {
            type: 'paragraph--link_teaser' as const,
            id: 'teaser-1',
            entityId: 2,
            drupal_internal__id: 2,
            drupal_internal__revision_id: 2,
            langcode: 'en',
            status: true,
            field_link: {
              uri: '/health-care/apply/',
              title: 'Apply for health care',
              options: {},
              url: '/health-care/apply/',
            },
            field_link_summary: 'Apply for VA health care benefits',
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
        fieldIntroText={'Manage your VA health care.'}
        fieldSpokes={mockSpokes}
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
})

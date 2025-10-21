import React from 'react'
import { render, screen } from '@testing-library/react'
import { BenefitsDetailPage } from './template'
import { BenefitsDetailPage as FormattedBenefitsDetailPage } from './formatted-type'

const mockData: FormattedBenefitsDetailPage = {
  id: '27aaaef6-0c67-4639-b7d7-84cb3c124cff',
  type: 'node--page',
  entityId: 298,
  entityPath: '/check-your-va-claim-or-appeal-status',
  published: true,
  title: 'Check Your VA Claim or Appeal Status',
  lastUpdated: '2020-04-30T20:11:16+00:00',
  description:
    'Find out how to check the status of a VA claim or appeal online.',
  introText:
    '<p>Find out how to check the status of a VA claim or appeal online.</p>\n',
  showTableOfContents: true,
  alert: null,
  featuredContent: [
    {
      id: '07b2ad1b-9b94-464a-8961-3ca73e84c8aa',
      type: 'paragraph--wysiwyg',
      entityId: 3886,
      html: '<h3>What you need to know</h3><p>You can check the status of your disability claim online.</p>',
    },
  ],
  contentBlock: [
    {
      id: 'b871d67e-44a1-45d7-a3c9-948795c0b10d',
      type: 'paragraph--wysiwyg',
      entityId: 3885,
      html: '<h2>How to check your VA claim or appeal status online</h2><p>Sign in to VA.gov to check the status of your VA claim or appeal.</p>',
    },
  ],
  relatedLinks: null,
  breadcrumbs: [
    {
      uri: 'http://va-gov-cms.ddev.site/',
      title: 'Home',
      options: [],
    },
    {
      uri: 'http://va-gov-cms.ddev.site/check-your-va-claim-or-appeal-status',
      title: 'Check Your VA Claim or Appeal Status',
      options: [],
    },
  ],
}

describe('BenefitsDetailPage with valid data', () => {
  test('renders BenefitsDetailPage component', () => {
    render(<BenefitsDetailPage {...mockData} />)

    expect(
      screen.queryByText('Check Your VA Claim or Appeal Status')
    ).toBeInTheDocument()
  })

  test('renders intro text when provided', () => {
    render(<BenefitsDetailPage {...mockData} />)

    expect(
      screen.queryByText(
        /Find out how to check the status of a VA claim or appeal online/
      )
    ).toBeInTheDocument()
  })

  test('renders table of contents when showTableOfContents is true', () => {
    const { container } = render(<BenefitsDetailPage {...mockData} />)

    const tableOfContents = container.querySelector('va-on-this-page')
    expect(tableOfContents).toBeInTheDocument()
  })

  test('does not render table of contents when showTableOfContents is false', () => {
    const { container } = render(
      <BenefitsDetailPage {...mockData} showTableOfContents={false} />
    )

    const tableOfContents = container.querySelector('va-on-this-page')
    expect(tableOfContents).not.toBeInTheDocument()
  })

  test('does not render related links when they are null', () => {
    const { container } = render(<BenefitsDetailPage {...mockData} />)

    const relatedLinks = container.querySelector('.va-nav-linkslist--related')
    expect(relatedLinks).not.toBeInTheDocument()
  })
})

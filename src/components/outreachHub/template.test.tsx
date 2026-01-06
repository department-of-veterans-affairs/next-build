import React from 'react'
import { render, screen } from '@testing-library/react'
import { OutreachHub } from './template'
import { OutreachHub as FormattedOutreachHub } from './formatted-type'

const mockData: FormattedOutreachHub = {
  id: 'c715d441-b6cb-4067-92eb-0650e97b7d62',
  type: 'node--office',
  entityId: 126,
  entityPath: '/va-central-office',
  published: true,
  title: 'VA Central Office',
  lastUpdated: '2019-09-04T19:14:37+00:00',
  description:
    'The VA Central Office provides leadership and oversight for Veterans Affairs programs and services.',
  body: '<p>The VA Central Office is responsible for coordinating and managing VA programs nationwide.</p><p>We work to ensure that Veterans receive the best possible care and services.</p>',
  menu: {
    rootPath: '/va-central-office/',
    data: {
      description: null,
      links: [],
      name: 'Outreach and events',
    },
  },
  breadcrumbs: [
    {
      href: '/',
      label: 'Home',
      options: [],
    },
    {
      href: '/va-central-office',
      label: 'VA Central Office',
      options: [],
    },
  ],
}

describe('OutreachHub', () => {
  it('renders the title', () => {
    render(<OutreachHub {...mockData} />)
    expect(screen.getByText('VA Central Office')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<OutreachHub {...mockData} />)
    expect(
      screen.getByText(
        'The VA Central Office provides leadership and oversight for Veterans Affairs programs and services.'
      )
    ).toBeInTheDocument()
  })

  it('renders the body content', () => {
    render(<OutreachHub {...mockData} />)
    expect(
      screen.getByText(
        'The VA Central Office is responsible for coordinating and managing VA programs nationwide.'
      )
    ).toBeInTheDocument()
  })

  it('renders without description when description is null', () => {
    const dataWithoutDescription = {
      ...mockData,
      description: null,
    }
    render(<OutreachHub {...dataWithoutDescription} />)
    expect(screen.getByText('VA Central Office')).toBeInTheDocument()
    expect(
      screen.queryByText(
        'The VA Central Office provides leadership and oversight for Veterans Affairs programs and services.'
      )
    ).not.toBeInTheDocument()
  })

  it('renders without body when body is null', () => {
    const dataWithoutBody = {
      ...mockData,
      body: null,
    }
    render(<OutreachHub {...dataWithoutBody} />)
    expect(screen.getByText('VA Central Office')).toBeInTheDocument()
    expect(
      screen.queryByText(
        'The VA Central Office is responsible for coordinating and managing VA programs nationwide.'
      )
    ).not.toBeInTheDocument()
  })
})

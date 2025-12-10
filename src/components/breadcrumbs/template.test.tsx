import React from 'react'
import { render } from '@testing-library/react'
import Breadcrumbs from './template'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const mockBreadcrumbs = [
  { href: '/home', label: 'Home', options: [] },
  { href: '/test', label: 'Test', options: [] },
]

describe('<Breadcrumbs />', () => {
  it('should render breadcrumbs', () => {
    const { container } = render(<Breadcrumbs breadcrumbs={mockBreadcrumbs} />)
    const vaBreadcrumbs = container.querySelector('va-breadcrumbs')
    expect(vaBreadcrumbs).toBeInTheDocument()
    expect(vaBreadcrumbs).toHaveAttribute(
      'breadcrumb-list',
      JSON.stringify(mockBreadcrumbs)
    )
  })

  it('should return null when no breadcrumbs are provided', () => {
    const { container } = render(<Breadcrumbs />)
    const vaBreadcrumbs = container.querySelector('va-breadcrumbs')
    expect(vaBreadcrumbs).not.toBeInTheDocument()
  })

  it('should replace last breadcrumb with resource title when BenefitsHub resource is provided', () => {
    const breadcrumbs = [
      { uri: '/', title: 'Home', options: [] },
      { uri: '/health-care', title: 'Health care', options: [] },
    ]

    const benefitsHubResource = {
      type: RESOURCE_TYPES.BENEFITS_HUB,
      title: 'VA health care',
      titleIcon: 'health-care',
      id: 'test-id',
      published: true,
      lastUpdated: '2024-01-01',
    } as const

    // Test using BenefitsHub resource which automatically replaces last breadcrumb
    const { container } = render(
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        entityPath="/health-care"
        resource={benefitsHubResource}
      />
    )

    // Should replace the last breadcrumb with the resource title
    const breadcrumbsJson = container
      .querySelector('va-breadcrumbs')
      ?.getAttribute('breadcrumb-list')
    expect(breadcrumbsJson).toBeTruthy()

    const parsedBreadcrumbs = JSON.parse(breadcrumbsJson || '[]')
    expect(parsedBreadcrumbs).toHaveLength(2)
    expect(parsedBreadcrumbs[1].label).toBe('VA health care')
    expect(parsedBreadcrumbs[1].href).toBe('/health-care')
  })
})

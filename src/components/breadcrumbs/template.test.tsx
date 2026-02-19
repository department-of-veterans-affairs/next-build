import React from 'react'
import { render } from '@testing-library/react'
import Breadcrumbs from './template'

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
})

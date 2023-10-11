import React from 'react'
import { render } from '@testing-library/react'
import Breadcrumbs from '.'

describe('<Breadcrumbs />', () => {
  const defaultProps = {
    breadcrumbs: [{ uri: '/home', title: 'Home', options: [] }],
    entityPath: '/test',
    breadcrumbTitle: 'Test',
  }

  it('should return null when no breadcrumbs are provided', () => {
    const { container } = render(<Breadcrumbs />)
    expect(container.firstChild).toBeNull()
  })

  it('should hide the "Home" breadcrumb when hideHomeBreadcrumb is true', () => {
    const { queryByText } = render(
      <Breadcrumbs {...defaultProps} hideHomeBreadcrumb={true} />
    )
    expect(queryByText('Home')).not.toBeInTheDocument()
  })

  it('should replace "Home" breadcrumb title with customCrumbHomeText', () => {
    const customText = 'Custom Home'
    const { queryByText } = render(
      <Breadcrumbs
        {...defaultProps}
        hideHomeBreadcrumb={true}
        customCrumbHomeText={customText}
      />
    )
    expect(queryByText(customText)).toBeInTheDocument()
  })

  it('should derive breadcrumbs from the URL', () => {
    const { queryByText } = render(
      <Breadcrumbs {...defaultProps} deriveBreadcrumbsFromUrl={true} />
    )
    expect(queryByText('Test')).toBeInTheDocument()
  })

  it('should construct lc breadcrumbs', () => {
    const { queryByText } = render(
      <Breadcrumbs {...defaultProps} constructLcBreadcrumbs={true} />
    )
    expect(queryByText('Resources and support')).toBeInTheDocument()
  })

  it('should filter out invalid crumbs', () => {
    const breadcrumbsWithInvalid = [
      { uri: '/home', title: 'Home', options: [] },
      { uri: 'internal:#', title: 'Invalid', options: [] },
      { uri: '/valid', title: 'Valid', options: [] },
    ]
    const { queryByText } = render(
      <Breadcrumbs breadcrumbs={breadcrumbsWithInvalid} />
    )
    expect(queryByText('Invalid')).not.toBeInTheDocument()
  })
})

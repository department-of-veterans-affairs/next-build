import React from 'react'
import { render, screen } from '@testing-library/react'
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
    const customCrumbHomeText = 'Start'
    const { container } = render(
      <Breadcrumbs
        {...defaultProps}
        customCrumbHomeText={customCrumbHomeText}
      />
    )
    expect(container.innerHTML).toContain(customCrumbHomeText)
    expect(container.innerHTML).not.toContain('Home')
  })

  it('should remove Home breadcrumb when hideHomeBreadcrumb is true', () => {
    const breadcrumbs = [{ title: 'Home' }, { title: 'Page' }]
    const { container } = render(
      <Breadcrumbs {...breadcrumbs} hideHomeBreadcrumb={true} />
    )
    expect(container.innerHTML).not.toContain('Home')
  })

  it('should derive breadcrumbs from the URL', () => {
    const breadcrumbTitle = 'Last'
    const entityPath = '/last'
    const replaceLastItem = true
    const { container } = render(
      <Breadcrumbs
        {...defaultProps}
        breadcrumbTitle={breadcrumbTitle}
        entityPath={entityPath}
        replaceLastItem={replaceLastItem}
        deriveBreadcrumbsFromUrl={true}
      />
    )
    expect(container.innerHTML).toContain(breadcrumbTitle)
  })

  it('should construct rc breadcrumbs', () => {
    const breadcrumbTitle = 'Rc'
    const entityPath = '/rc'
    const RcBreadcrumbsTitleInclude = true
    const { container } = render(
      <Breadcrumbs
        {...defaultProps}
        breadcrumbTitle={breadcrumbTitle}
        entityPath={entityPath}
        RcBreadcrumbsTitleInclude={RcBreadcrumbsTitleInclude}
        constructRcBreadcrumbs={true}
      />
    )
    expect(container.innerHTML).toContain(breadcrumbTitle)
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

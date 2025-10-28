import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '@/pages/index'

describe('FrontPage', () => {
  const mockProps = {
    footerData: { test: 'footer' },
    megaMenuData: { test: 'menu' },
    bannerData: [{ test: 'banner' }],
    heroData: { test: 'hero' },
  }

  it.skip('renders the page layout and main content', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByText('TODO: add HERO')).toBeInTheDocument()
    expect(screen.getByText('TODO: add Common tasks')).toBeInTheDocument()
    expect(screen.getByText('TODO: add news-spotlight')).toBeInTheDocument()
    expect(screen.getByText('TODO: add homepage-benefits')).toBeInTheDocument()
    expect(screen.getByText('TODO: add Medallia')).toBeInTheDocument()
    expect(screen.getByText('TODO: add email signup')).toBeInTheDocument()
  })
})

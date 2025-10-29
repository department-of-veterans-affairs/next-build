import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '@/pages/index'

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    toString: () => '',
  }),
}))
describe('FrontPage', () => {
  const mockProps = {
    footerData: { test: 'footer' },
    megaMenuData: { test: 'menu' },
    bannerData: [{ test: 'banner' }],
    heroData: {
      promoHeadline: 'Your VA Benefits',
      promoCta: { title: 'Learn More', url: '/learn-more' },
      promoText: 'Find out how to access your benefits.',
      ctaSummaryText: 'Get started with your account',
      primaryCtaButtonText: 'Sign In',
      relatedInfoLinks: [
        { title: 'Health Care', url: '/health-care' },
        { title: 'Disability', url: '/disability' },
      ],
    },
  }

  it('renders the page layout and main content', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByText('TODO: add Common tasks')).toBeInTheDocument()
    expect(screen.getByText('TODO: add news-spotlight')).toBeInTheDocument()
    expect(screen.getByText('TODO: add homepage-benefits')).toBeInTheDocument()
    expect(screen.getByText('TODO: add email signup')).toBeInTheDocument()
  })
})

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
    commonTasksData: {
      searchLinks: [{ label: 'Search', url: '/search' }],
      popularLinks: [{ label: 'Popular', url: '/popular' }],
    },
    newsSpotlightData: {
      headline: 'VA announces new benefits for Veterans',
      link: {
        url: '/news/va-announces-new-benefits',
        text: 'Read the full article',
      },
      promoText:
        'The Department of Veterans Affairs is expanding access to healthcare services for millions of Veterans across the country.',
      image: {
        id: 'mock-image-id',
        alt: 'VA News Spotlight Image',
        title: 'VA News',
      },
    },
  }

  it('renders the page layout and main content', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('common-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('news-spotlight')).toBeInTheDocument()
    expect(screen.getByText('TODO: add homepage-benefits')).toBeInTheDocument()
    expect(screen.getByText('TODO: add email signup')).toBeInTheDocument()
  })
})

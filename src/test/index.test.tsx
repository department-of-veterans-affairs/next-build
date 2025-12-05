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
    benefitsData: {
      benefitsHubLinks: [
        {
          url: '/health-care',
          title: 'Health Care',
          description: 'Find out how to access your health care benefits.',
          icon: 'health-care',
        },
        {
          url: '/disability',
          title: 'Disability',
          description: 'Find out how to access your disability benefits.',
          icon: 'disability',
        },
      ],
    },
  }

  it('renders the page layout and main content', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('common-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('news-spotlight')).toBeInTheDocument()
    expect(screen.getByTestId('home-page-benefits')).toBeInTheDocument()
    expect(
      document.querySelector('[data-widget-type="homepage-email-signup"]')
    ).toBeInTheDocument()
    expect(document.querySelector('#vets-banner-1')).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    toString: () => '',
  }),
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
  notFound: jest.fn(),
}))

// Mock queries
jest.mock('../lib/drupal/queries', () => ({
  queries: {
    getData: jest.fn((queryName: string) => {
      const mockData = {
        'footer-data': [],
        'header-data': [],
        'banner-data': [],
        'hero-data': {
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
        'home-page-common-tasks': {
          searchLinks: [{ title: 'Search', url: '/search' }],
          popularLinks: [{ title: 'Popular', url: '/popular' }],
        },
        'home-page-news-spotlight': {
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
            width: 628,
            height: 628,
            links: {
              crop_square: {
                href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/crop_square/public/news_promos/Health-and-benefits-distro-graphics_sq.jpg',
                meta: {
                  linkParams: {
                    width: 500,
                    height: 500,
                  },
                },
              },
            },
          },
        },
        'home-page-benefits': {
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
      return Promise.resolve(mockData[queryName] || [])
    }),
  },
}))

describe('FrontPage', () => {
  beforeEach(() => {
    // Set feature flag to allow the page to render
    process.env.FEATURE_NEXT_BUILD_CONTENT_ALL = 'true'
  })

  afterEach(() => {
    delete process.env.FEATURE_NEXT_BUILD_CONTENT_ALL
  })

  it('renders the page layout and main content', async () => {
    const HomePageComponent = await HomePage()
    const { container } = render(HomePageComponent as React.ReactElement)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('common-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('news-spotlight')).toBeInTheDocument()
    expect(screen.getByTestId('home-page-benefits')).toBeInTheDocument()
    expect(screen.getByTestId('home-page-email-signup')).toBeInTheDocument()
    expect(container.querySelector('#vets-banner-1')).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { HomePageHero } from './template'

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    toString: () => '',
  }),
}))

describe('HomePageHero', () => {
  const defaultProps = {
    promoHeadline: 'Your VA Benefits',
    promoCta: { title: 'Learn More', url: '/learn-more' },
    promoText: 'Find out how to access your benefits.',
    ctaSummaryText: 'Get started with your account',
    primaryCtaButtonText: 'Sign In',
    relatedInfoLinks: [
      { title: 'Health Care', url: '/health-care' },
      { title: 'Disability', url: '/disability' },
    ],
  }

  it('renders hero headline, promo headline, and promo text', () => {
    render(<HomePageHero {...defaultProps} />)
    expect(screen.getByText('Welcome to VA.gov')).toBeInTheDocument()
    expect(screen.getByText(defaultProps.promoHeadline)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.promoText)).toBeInTheDocument()
  })

  it('renders promo CTA link', () => {
    render(<HomePageHero {...defaultProps} />)
    expect(screen.getByTestId('promoCta')).toHaveAttribute(
      'text',
      defaultProps.promoCta.title
    )
    expect(screen.getByTestId('promoCta')).toHaveAttribute(
      'href',
      defaultProps.promoCta.url
    )
  })

  it('renders summary text and primary CTA button', () => {
    render(<HomePageHero {...defaultProps} />)
    expect(screen.getByText(defaultProps.ctaSummaryText)).toBeInTheDocument()
    expect(screen.getByTestId('ctaButton')).toHaveAttribute(
      'text',
      defaultProps.primaryCtaButtonText
    )
  })

  it('renders related info links', () => {
    render(<HomePageHero {...defaultProps} />)
    defaultProps.relatedInfoLinks.forEach((link, index) => {
      expect(screen.getByTestId(`related-link-${index}`)).toHaveAttribute(
        'text',
        link.title
      )
    })
  })
})

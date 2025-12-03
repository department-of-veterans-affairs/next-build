import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { HomePageNewsSpotlight } from './template'
import { NewsSpotlightData } from './formatted-type'
import { MediaImage as FormattedMediaImage } from '@/components/mediaDocument/formatted-type'

const mockImage: FormattedMediaImage = {
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
}

const defaultProps: NewsSpotlightData = {
  image: mockImage,
  headline: 'VA announces new benefits for Veterans',
  link: {
    url: '/news/va-announces-new-benefits',
    text: 'Read the full article',
  },
  promoText:
    'The Department of Veterans Affairs is expanding access to healthcare services for millions of Veterans across the country.',
}

function getLinkByText(text: string) {
  return document.querySelector(`va-link[text="${text}"]`)
}

describe('HomePageNewsSpotlight', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<HomePageNewsSpotlight {...defaultProps} />)
    const axeResults = await axe(container, {
      rules: {
        // It's only empty because it isn't evaluating the `<va-link>` element inside it.
        'empty-heading': { enabled: false },
      },
    })
    expect(axeResults).toHaveNoViolations()
  })

  it('renders headline and promo text', () => {
    render(<HomePageNewsSpotlight {...defaultProps} />)

    expect(getLinkByText(defaultProps.headline)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.promoText)).toBeInTheDocument()
  })

  it('renders more news link with correct href', () => {
    render(<HomePageNewsSpotlight {...defaultProps} />)

    const moreNewsLink = getLinkByText('More VA news')
    expect(moreNewsLink).toBeInTheDocument()
    expect(moreNewsLink).toHaveAttribute('href', 'https://news.va.gov/')
  })

  it('renders link text within promo text', () => {
    render(<HomePageNewsSpotlight {...defaultProps} />)

    const promoLink = getLinkByText(defaultProps.link.text)
    expect(promoLink).toBeInTheDocument()
    expect(promoLink).toHaveAttribute('text', defaultProps.link.text)
    expect(promoLink).toHaveAttribute('href', defaultProps.link.url)
  })

  it('renders image', () => {
    render(<HomePageNewsSpotlight {...defaultProps} />)

    const image = screen.getByAltText(defaultProps.image.alt)
    expect(image).toBeInTheDocument()
  })
})

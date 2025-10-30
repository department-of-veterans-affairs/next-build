import React from 'react'
import { render, screen } from '@testing-library/react'
import { CampaignLandingPage, CampaignLandingPageProps } from './template'
import { axe } from '@/test-utils'
import { HeroBanner } from './HeroBanner'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { WhyThisMatters } from './WhyThisMatters'
import { DrupalFile } from 'next-drupal'
import {
  MediaImage,
  MediaImageLinks,
} from '@/components/mediaDocument/formatted-type'
import { FieldLink } from '@/types/drupal/field_type'

const mockBaseProps: Partial<CampaignLandingPageProps> = {
  title: 'Testing title',
  hero: {
    blurb: 'This is the test hero blurb',
    image: {
      alt: '',
      links: {
        '1_1_square_large': {
          href: 'https://example.com/hero-image.png',
        } as unknown as MediaImageLinks,
      },
    } as unknown as MediaImage,
  },
  cta: {
    primary: {
      label: 'primary cta label',
      href: '#primary-cta',
    },
    secondary: {
      label: 'secondary cta label',
      href: '#secondary-cta',
    },
  },
  whyThisMatters: 'test why it matters',
  audience: [{ name: 'audience 1' }, { name: 'audience 2' }],
  socialLinks: [
    {
      icon: 'social-icon-1',
      href: '/social-href-1',
      text: 'social text 1',
    },
    {
      icon: 'social-icon-2',
      href: '/social-href-2',
      text: 'social text 2',
    },
  ],
  whatYouCanDo: {
    header: 'WhatYouCanDo header',
    intro: 'WhatYouCanDo intro',
    promos: [
      {
        link: {
          field_link: {
            url: '?promo-1',
            title: 'Promo 1 link',
          } as FieldLink,
          field_link_summary: 'Summary of field link 1',
        } as ParagraphLinkTeaser,
        image: {
          alt: '',
          links: {
            '3_2_medium_thumbnail': {
              href: 'https://example.com/promo-1-image.png',
            } as unknown as MediaImageLinks,
          },
        } as unknown as MediaImage,
      },
    ],
  },
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return <img {...props} />
  },
}))

beforeAll(() => {
  defineCustomElements()
})

describe('CampaignLandingPage with valid data', () => {
  test('CampaignLandingPage component renders all sub components', async () => {
    const { container } = await render(
      <CampaignLandingPage {...(mockBaseProps as CampaignLandingPageProps)} />
    )

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByTestId('why-this-matters')).toBeInTheDocument()

    // TODO: Check that the other components rendered once they're built
  })

  test('CampaignLandingPage component renders with no axe violations', async () => {
    const { container } = await render(
      <CampaignLandingPage
        onlyRenderFinishedComponents
        {...(mockBaseProps as CampaignLandingPageProps)}
      />
    )

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

describe('CampaignLandingPage->HeroBanner', () => {
  beforeEach(async () => {
    await render(
      <HeroBanner {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows page title', () => {
    expect(screen.getByText(mockBaseProps.title)).toBeInTheDocument()
  })

  test('shows blurb', () => {
    expect(screen.getByText(mockBaseProps.hero.blurb)).toBeInTheDocument()
  })

  test('shows primary cta link', () => {
    const link = screen.getByTestId('primary-cta')

    expect(link.localName).toBe('va-link-action')
    expect(link.href).toBe(mockBaseProps.cta.primary.href)
    expect(link.text).toBe(mockBaseProps.cta.primary.label)
  })

  test('shows hero image with 1:1 aspect ratio', () => {
    const img = screen.getByTestId('hero-image')

    expect(img.src).toBe(
      mockBaseProps.hero.image.links['1_1_square_large'].href
    )

    // Empty alt intentional
    // See https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22439
    expect(img.alt).toBe('')

    // 1:1 aspect ratio
    expect(img.style['aspect-ratio']).toBe('1/1')
    expect(img.style['object-fit']).toBe('cover')
  })
})

describe('CampaignLandingPage->WhyThisMatters', () => {
  beforeEach(async () => {
    await render(
      <WhyThisMatters {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows why it matters', () => {
    expect(screen.getByText(mockBaseProps.whyThisMatters)).toBeInTheDocument()
  })

  test('show secondary cta', () => {
    const link = screen.getByTestId('secondary-cta')

    expect(link.localName).toBe('va-link-action')
    expect(link.href).toBe(mockBaseProps.cta.secondary.href)
    expect(link.text).toBe(mockBaseProps.cta.secondary.label)
  })

  test('shows audiences', () => {
    mockBaseProps.audience.map(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })
})

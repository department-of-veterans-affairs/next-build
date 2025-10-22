import React from 'react'
import { render, screen } from '@testing-library/react'
import { CampaignLandingPage, CampaignLandingPageProps } from './template'
import { axe } from '@/test-utils'
import { HeroBanner } from './HeroBanner'

import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { ImageProps } from 'next/image'
import { DrupalFile } from 'next-drupal'

const mockBaseProps: Partial<CampaignLandingPageProps> = {
  title: 'Testing title',
  hero: {
    cta: {
      primary: {
        label: 'primary cta label',
        href: '#primary-cta',
      },
    },
    blurb: 'This is the test hero blurb',
    image: {
      links: {
        '1_1_square_large': {
          href: 'https://example.com/hero-image.png',
        } as unknown as DrupalFile,
      },
    } as unknown as DrupalFile,
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

    const hero = screen.getByTestId('hero-banner')
    expect(hero).toBeInTheDocument()

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
    expect(link.href).toBe(mockBaseProps.hero.cta.primary.href)
    expect(link.text).toBe(mockBaseProps.hero.cta.primary.label)
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

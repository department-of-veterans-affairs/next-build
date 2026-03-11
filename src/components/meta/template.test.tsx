import React from 'react'
import { render } from '@testing-library/react'
import { Meta } from './template'
import { MetaTag } from '@/types/formatted/metatags'
import { BUILD_TYPES } from '@/lib/constants/environment'

const mockResource = {
  title: 'VA.gov',
  entityPath: '/',
  lastUpdated: '2024-01-01T00:00:00Z',
}

// Mock environment variables
const originalBuildType = process.env.NEXT_PUBLIC_BUILD_TYPE
const originalSiteUrl = process.env.SITE_URL
const originalNextPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

// Helper functions for assertions
function getAllMetaTags() {
  return Array.from(document.head.querySelectorAll('meta'))
}

function getMetaTagByName(name: string) {
  return document.head.querySelector(`meta[name="${name}"]`)
}

function getMetaTagByProperty(property: string) {
  return document.head.querySelector(`meta[property="${property}"]`)
}

function getAllLinkTags() {
  return Array.from(document.head.querySelectorAll('link'))
}

function getLinkTag(rel: string) {
  return document.head.querySelector(`link[rel="${rel}"]`)
}

function getTitle() {
  const titleElement = document.head.querySelector('title')
  return titleElement?.textContent || ''
}

// Helper to extract meta tags, link tags, and title from rendered output (for snapshots)
function getAllTags() {
  return {
    title: document.head.querySelector('title'),
    metaTags: getAllMetaTags(),
    links: getAllLinkTags(),
  }
}

describe('Meta component', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    delete process.env.NEXT_PUBLIC_BUILD_TYPE
    delete process.env.SITE_URL
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  afterAll(() => {
    // Restore original environment variables
    if (originalBuildType) {
      process.env.NEXT_PUBLIC_BUILD_TYPE = originalBuildType
    }
    if (originalSiteUrl) {
      process.env.SITE_URL = originalSiteUrl
    }
    if (originalNextPublicSiteUrl) {
      process.env.NEXT_PUBLIC_SITE_URL = originalNextPublicSiteUrl
    }
  })

  describe('Default tags', () => {
    it('renders default meta tags with basic resource (snapshot)', () => {
      render(<Meta resource={mockResource} />)
      const renderedTags = getAllTags()
      expect(renderedTags).toMatchSnapshot()
    })

    it('renders default tags with custom title', () => {
      render(<Meta resource={{ ...mockResource, title: 'Health Care' }} />)

      expect(getTitle()).toBe('Health Care | Veterans Affairs')
      expect(getMetaTagByProperty('og:title')?.getAttribute('content')).toBe(
        'Health Care | Veterans Affairs'
      )
      expect(getMetaTagByName('twitter:title')?.getAttribute('content')).toBe(
        'Health Care | Veterans Affairs'
      )
    })

    it('renders with lastUpdated date formatted correctly', () => {
      render(
        <Meta
          resource={{ ...mockResource, lastUpdated: '2024-03-15T10:30:00Z' }}
        />
      )

      const dcDateTag = getMetaTagByName('DC.Date')
      expect(dcDateTag).toBeDefined()
      expect(dcDateTag?.getAttribute('content')).toBe('2024-03-15')
    })

    it('renders canonical link from entityPath', () => {
      process.env.SITE_URL = 'https://www.va.gov'
      render(<Meta resource={{ ...mockResource, entityPath: '/test-page' }} />)

      const canonicalLink = getLinkTag('canonical')
      expect(canonicalLink).toBeDefined()
      expect(canonicalLink?.getAttribute('href')).toBe(
        'https://www.va.gov/test-page/'
      )
    })

    it('renders canonical link from canonicalLink when provided', () => {
      process.env.SITE_URL = 'https://www.va.gov'
      render(
        <Meta
          resource={{ ...mockResource, canonicalLink: '/custom-canonical' }}
        />
      )

      const canonicalLink = getLinkTag('canonical')
      expect(canonicalLink).toBeDefined()
      expect(canonicalLink?.getAttribute('href')).toBe(
        'https://www.va.gov/custom-canonical/'
      )
    })
  })

  describe('Custom metatags', () => {
    it('renders custom metatags when provided (snapshot)', () => {
      const customMetatags: MetaTag[] = [
        {
          tag: 'meta',
          attributes: {
            name: 'title',
            content: 'Custom Title',
          },
        },
        {
          tag: 'meta',
          attributes: {
            name: 'description',
            content: 'Custom description',
          },
        },
        {
          tag: 'meta',
          attributes: {
            property: 'og:title',
            content: 'Custom OG Title',
          },
        },
      ]

      render(<Meta resource={{ ...mockResource, metatags: customMetatags }} />)
      const renderedTags = getAllTags()
      expect(renderedTags).toMatchSnapshot()
    })

    it('handles complex custom metatags', () => {
      const customMetatags: MetaTag[] = [
        {
          tag: 'meta',
          attributes: {
            name: 'title',
            content: 'Complex Page Title',
          },
        },
        {
          tag: 'meta',
          attributes: {
            property: 'og:image',
            content: '/custom-image.jpg',
          },
        },
        {
          tag: 'meta',
          attributes: {
            property: 'og:image:alt',
            content: 'Custom image alt text',
          },
        },
        {
          tag: 'meta',
          attributes: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        },
      ]

      render(<Meta resource={{ ...mockResource, metatags: customMetatags }} />)

      expect(getTitle()).toBe('Complex Page Title')
      expect(getMetaTagByProperty('og:image')?.getAttribute('content')).toBe(
        '/custom-image.jpg'
      )
      expect(
        getMetaTagByProperty('og:image:alt')?.getAttribute('content')
      ).toBe('Custom image alt text')
      expect(getMetaTagByName('twitter:card')?.getAttribute('content')).toBe(
        'summary_large_image'
      )
    })
  })

  describe('iOS Banner tags', () => {
    it('renders iOS banner tags for specific URLs (snapshot)', () => {
      const resource = {
        title: 'Refill Prescriptions',
        entityPath: '/health-care/refill-track-prescriptions',
        lastUpdated: '2024-01-01T00:00:00Z',
      }
      render(<Meta resource={resource} />)
      const renderedTags = getAllTags()
      expect(renderedTags).toMatchSnapshot()
    })

    it('does not render iOS banner tags for other URLs', () => {
      render(<Meta resource={mockResource} />)

      expect(getMetaTagByName('apple-itunes-app')).toBeNull()
      expect(getMetaTagByName('smartbanner:title')).toBeNull()
    })

    it('renders iOS banner tags for secure messaging', () => {
      const resource = {
        title: 'Secure Messaging',
        entityPath: '/health-care/secure-messaging',
        lastUpdated: '2024-01-01T00:00:00Z',
      }
      render(<Meta resource={resource} />)

      expect(getMetaTagByName('apple-itunes-app')).toBeDefined()
      expect(
        getMetaTagByName('smartbanner:button-url-apple')?.getAttribute(
          'content'
        )
      ).toContain('apps.apple.com')
    })
  })

  describe('Robots meta tag', () => {
    it('renders noindex when not in production', () => {
      process.env.NEXT_PUBLIC_BUILD_TYPE = BUILD_TYPES.DEV
      render(<Meta resource={mockResource} />)

      const robotsTag = getMetaTagByName('robots')
      expect(robotsTag).toBeDefined()
      expect(robotsTag?.getAttribute('content')).toBe('noindex')
    })

    it('does not render noindex in production', () => {
      process.env.NEXT_PUBLIC_BUILD_TYPE = BUILD_TYPES.PROD
      render(<Meta resource={mockResource} />)

      const robotsTag = getMetaTagByName('robots')
      expect(robotsTag).toBeNull()
    })
  })

  describe('Description prop', () => {
    it('renders og:description, twitter:description, and description meta tags when description prop is provided', () => {
      const description =
        'Welcome to the official website of the U.S. Department of Veterans Affairs. Discover, apply for, and manage your VA benefits and care.'

      render(<Meta resource={mockResource} description={description} />)

      expect(
        getMetaTagByProperty('og:description')?.getAttribute('content')
      ).toBe(description)
      expect(
        getMetaTagByName('twitter:description')?.getAttribute('content')
      ).toBe(description)
      expect(getMetaTagByName('description')?.getAttribute('content')).toBe(
        description
      )
    })

    it('does not render description meta tags when description prop is omitted', () => {
      render(<Meta resource={mockResource} />)

      expect(getMetaTagByProperty('og:description')).toBeNull()
      expect(getMetaTagByName('twitter:description')).toBeNull()
      expect(getMetaTagByName('description')).toBeNull()
    })
  })

  describe('Edge cases', () => {
    it('handles missing entityPath', () => {
      const resource = {
        title: 'Test Page',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      render(<Meta resource={resource} />)

      // Should default to '/' for entityPath
      expect(getMetaTagByProperty('og:url')?.getAttribute('content')).toContain(
        '/'
      )
      // Should not render canonical link when entityPath is missing
      expect(getLinkTag('canonical')).toBeNull()
    })

    it('handles empty metatags array', () => {
      render(<Meta resource={{ ...mockResource, metatags: [] }} />)

      // Should fall back to default tags
      expect(getTitle()).toBe('VA.gov | Veterans Affairs')
      expect(getMetaTagByProperty('og:title')).toBeDefined()
    })

    it('handles invalid lastUpdated date', () => {
      render(
        <Meta resource={{ ...mockResource, lastUpdated: 'invalid-date' }} />
      )

      // Should not render DC.Date tag for invalid dates
      expect(getMetaTagByName('DC.Date')).toBeNull()
      // But should still render other tags
      expect(getTitle()).toBe('VA.gov | Veterans Affairs')
    })
  })
})

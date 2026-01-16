import React from 'react'
import { render } from '@testing-library/react'
import { Meta } from './template'
import { MetaTag } from '@/types/formatted/metatags'
import { BUILD_TYPES } from '@/lib/constants/environment'

// Mock environment variables
const originalBuildType = process.env.NEXT_PUBLIC_BUILD_TYPE
const originalSiteUrl = process.env.SITE_URL
const originalNextPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

// Helper to extract meta tags, link tags, and title from rendered output (for snapshots)
function extractRenderedTags(container: HTMLElement) {
  const result: {
    title?: string
    metaTags: Array<{
      name?: string
      property?: string
      content?: string
      httpEquiv?: string
      charSet?: string
    }>
    links: Array<{
      rel?: string
      href?: string
    }>
  } = {
    metaTags: [],
    links: [],
  }

  // Extract title - check container and document head
  const titleElement =
    container.querySelector('title') || document.head.querySelector('title')
  if (titleElement) {
    result.title = titleElement.textContent || ''
  }

  // Extract meta tags from container and document head
  const containerMetas = Array.from(container.querySelectorAll('meta'))
  const headMetas = Array.from(document.head.querySelectorAll('meta'))
  const allMetas = Array.from(new Set([...containerMetas, ...headMetas]))

  allMetas.forEach((meta) => {
    const metaObj: {
      name?: string
      property?: string
      content?: string
      httpEquiv?: string
      charSet?: string
    } = {}

    const name = meta.getAttribute('name')
    const property = meta.getAttribute('property')
    const content = meta.getAttribute('content')
    const httpEquiv = meta.getAttribute('httpEquiv')
    const charSet = meta.getAttribute('charSet')

    if (charSet) {
      metaObj.charSet = charSet
    } else if (httpEquiv) {
      metaObj.httpEquiv = httpEquiv
      metaObj.content = content || ''
    } else if (name) {
      metaObj.name = name
      metaObj.content = content || ''
    } else if (property) {
      metaObj.property = property
      metaObj.content = content || ''
    }

    if (Object.keys(metaObj).length > 0) {
      result.metaTags.push(metaObj)
    }
  })

  // Extract link tags from container and document head
  const containerLinks = Array.from(container.querySelectorAll('link'))
  const headLinks = Array.from(document.head.querySelectorAll('link'))
  const allLinks = Array.from(new Set([...containerLinks, ...headLinks]))

  allLinks.forEach((link) => {
    const rel = link.getAttribute('rel')
    const href = link.getAttribute('href')
    if (rel && href) {
      result.links.push({ rel, href })
    }
  })

  // Sort for consistent snapshots
  result.metaTags.sort((a, b) => {
    const aKey = a.name || a.property || a.httpEquiv || a.charSet || ''
    const bKey = b.name || b.property || b.httpEquiv || b.charSet || ''
    return aKey.localeCompare(bKey)
  })
  result.links.sort((a, b) => {
    const key = (a.rel || '').localeCompare(b.rel || '')
    return key !== 0 ? key : (a.href || '').localeCompare(b.href || '')
  })

  return result
}

// Helper functions for assertions
function getAllMetaTags(container: HTMLElement) {
  const containerMetas = Array.from(container.querySelectorAll('meta'))
  const headMetas = Array.from(document.head.querySelectorAll('meta'))
  return Array.from(new Set([...containerMetas, ...headMetas]))
}

function getMetaTag(
  container: HTMLElement,
  options: { name?: string; property?: string }
) {
  const allMetas = getAllMetaTags(container)
  return allMetas.find((meta) => {
    if (options.name) {
      return meta.getAttribute('name') === options.name
    }
    if (options.property) {
      return meta.getAttribute('property') === options.property
    }
    return false
  })
}

function getLinkTag(container: HTMLElement, rel: string) {
  const containerLinks = Array.from(container.querySelectorAll('link'))
  const headLinks = Array.from(document.head.querySelectorAll('link'))
  const allLinks = Array.from(new Set([...containerLinks, ...headLinks]))
  return allLinks.find((link) => link.getAttribute('rel') === rel)
}

function getTitle(container: HTMLElement) {
  const titleElement =
    container.querySelector('title') || document.head.querySelector('title')
  return titleElement?.textContent || ''
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
      const resource = {
        title: 'VA.gov',
        entityPath: '/',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)
      const renderedTags = extractRenderedTags(container)
      expect(renderedTags).toMatchSnapshot()
    })

    it('renders default tags with custom title', () => {
      const resource = {
        title: 'Health Care',
        entityPath: '/health-care',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      expect(getTitle(container)).toBe('Health Care | Veterans Affairs')
      expect(
        getMetaTag(container, { property: 'og:title' })?.getAttribute('content')
      ).toBe('Health Care | Veterans Affairs')
      expect(
        getMetaTag(container, { name: 'twitter:title' })?.getAttribute(
          'content'
        )
      ).toBe('Health Care | Veterans Affairs')
    })

    it('renders with lastUpdated date formatted correctly', () => {
      const resource = {
        title: 'Test Page',
        entityPath: '/test',
        lastUpdated: '2024-03-15T10:30:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      const dcDateTag = getMetaTag(container, { name: 'DC.Date' })
      expect(dcDateTag).toBeDefined()
      expect(dcDateTag?.getAttribute('content')).toBe('2024-03-15')
    })

    it('renders canonical link from entityPath', () => {
      process.env.SITE_URL = 'https://www.va.gov'
      const resource = {
        title: 'Test Page',
        entityPath: '/test-page',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      const canonicalLink = getLinkTag(container, 'canonical')
      expect(canonicalLink).toBeDefined()
      expect(canonicalLink?.getAttribute('href')).toBe(
        'https://www.va.gov/test-page/'
      )
    })

    it('renders canonical link from canonicalLink when provided', () => {
      process.env.SITE_URL = 'https://www.va.gov'
      const resource = {
        title: 'Test Page',
        entityPath: '/test-page',
        canonicalLink: '/custom-canonical',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      const canonicalLink = getLinkTag(container, 'canonical')
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

      const resource = {
        title: 'VA.gov',
        entityPath: '/',
        lastUpdated: '2024-01-01T00:00:00Z',
        metatags: customMetatags,
      }

      const { container } = render(<Meta resource={resource} />)
      const renderedTags = extractRenderedTags(container)
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

      const resource = {
        title: 'VA.gov',
        entityPath: '/complex-page',
        lastUpdated: '2024-01-01T00:00:00Z',
        metatags: customMetatags,
      }

      const { container } = render(<Meta resource={resource} />)

      expect(getTitle(container)).toBe('Complex Page Title')
      expect(
        getMetaTag(container, { property: 'og:image' })?.getAttribute('content')
      ).toBe('/custom-image.jpg')
      expect(
        getMetaTag(container, { property: 'og:image:alt' })?.getAttribute(
          'content'
        )
      ).toBe('Custom image alt text')
      expect(
        getMetaTag(container, { name: 'twitter:card' })?.getAttribute('content')
      ).toBe('summary_large_image')
    })
  })

  describe('iOS Banner tags', () => {
    it('renders iOS banner tags for specific URLs (snapshot)', () => {
      const resource = {
        title: 'Refill Prescriptions',
        entityPath: '/health-care/refill-track-prescriptions',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)
      const renderedTags = extractRenderedTags(container)
      expect(renderedTags).toMatchSnapshot()
    })

    it('does not render iOS banner tags for other URLs', () => {
      const resource = {
        title: 'Regular Page',
        entityPath: '/regular-page',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      expect(
        getMetaTag(container, { name: 'apple-itunes-app' })
      ).toBeUndefined()
      expect(
        getMetaTag(container, { name: 'smartbanner:title' })
      ).toBeUndefined()
    })

    it('renders iOS banner tags for secure messaging', () => {
      const resource = {
        title: 'Secure Messaging',
        entityPath: '/health-care/secure-messaging',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      expect(getMetaTag(container, { name: 'apple-itunes-app' })).toBeDefined()
      expect(
        getMetaTag(container, {
          name: 'smartbanner:button-url-apple',
        })?.getAttribute('content')
      ).toContain('apps.apple.com')
    })
  })

  describe('Robots meta tag', () => {
    it('renders noindex when not in production', () => {
      process.env.NEXT_PUBLIC_BUILD_TYPE = BUILD_TYPES.DEV
      const resource = {
        title: 'Test Page',
        entityPath: '/test',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      const robotsTag = getMetaTag(container, { name: 'robots' })
      expect(robotsTag).toBeDefined()
      expect(robotsTag?.getAttribute('content')).toBe('noindex')
    })

    it('does not render noindex in production', () => {
      process.env.NEXT_PUBLIC_BUILD_TYPE = BUILD_TYPES.PROD
      const resource = {
        title: 'Test Page',
        entityPath: '/test',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      const robotsTag = getMetaTag(container, { name: 'robots' })
      expect(robotsTag).toBeUndefined()
    })
  })

  describe('Edge cases', () => {
    it('handles missing entityPath', () => {
      const resource = {
        title: 'Test Page',
        lastUpdated: '2024-01-01T00:00:00Z',
      }

      const { container } = render(<Meta resource={resource} />)

      // Should default to '/' for entityPath
      expect(
        getMetaTag(container, { property: 'og:url' })?.getAttribute('content')
      ).toContain('/')
      // Should not render canonical link when entityPath is missing
      expect(getLinkTag(container, 'canonical')).toBeUndefined()
    })

    it('handles empty metatags array', () => {
      const resource = {
        title: 'Test Page',
        entityPath: '/test',
        lastUpdated: '2024-01-01T00:00:00Z',
        metatags: [],
      }

      const { container } = render(<Meta resource={resource} />)

      // Should fall back to default tags
      expect(getTitle(container)).toBe('Test Page | Veterans Affairs')
      expect(getMetaTag(container, { property: 'og:title' })).toBeDefined()
    })

    it('handles invalid lastUpdated date', () => {
      const resource = {
        title: 'Test Page',
        entityPath: '/test',
        lastUpdated: 'invalid-date',
      }

      const { container } = render(<Meta resource={resource} />)

      // Should not render DC.Date tag for invalid dates
      expect(getMetaTag(container, { name: 'DC.Date' })).toBeUndefined()
      // But should still render other tags
      expect(getTitle(container)).toBe('Test Page | Veterans Affairs')
    })
  })
})

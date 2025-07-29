/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import ResourcePage from '../app/[[...slug]]/page'
import { queries } from '@/data/queries'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'

// Mock Next.js App Router functions
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('next/headers', () => ({
  draftMode: jest.fn(),
}))

// Mock data fetching functions
jest.mock('@/data/queries', () => ({
  queries: {
    getData: jest.fn(),
  },
}))

jest.mock('@/lib/drupal/drupalClient', () => ({
  drupalClient: {
    translatePathFromContext: jest.fn(),
    translatePath: jest.fn(),
  },
}))

jest.mock('@/lib/drupal/getGlobalElements', () => ({
  getGlobalElements: jest.fn(),
}))

// Mock dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: () => Promise<unknown>) => {
    const Component = () => null
    Component.displayName = 'DynamicComponent'
    return Component
  },
}))

// Mock all the template components
jest.mock('@/templates/layouts/wrapper', () => ({
  Wrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}))

jest.mock('@/templates/common/meta', () => ({
  Meta: () => <div data-testid="meta" />,
}))

jest.mock('@/templates/common/util/HTMLComment', () => ({
  __esModule: true,
  default: () => <div data-testid="html-comment" />,
}))

jest.mock('@/templates/common/preview', () => ({
  PreviewCrumb: () => <div data-testid="preview-crumb" />,
}))

jest.mock('@/products/event/template', () => ({
  Event: () => <div data-testid="event-template" />,
}))

describe('App Router [[...slug]] page', () => {
  const mockDraftMode = {
    isEnabled: false,
  }

  const mockPathInfo = {
    jsonapi: { resourceName: 'node--event' },
    entity: { uuid: 'test-uuid-123' },
  }

  const mockResource = {
    type: 'node--event',
    entityPath: '/test-path',
    entityId: 'test-id',
    breadcrumbs: [],
  }

  const mockGlobalElements = {
    bannerData: [],
    headerFooterData: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(draftMode as jest.Mock).mockReturnValue(mockDraftMode)
    ;(drupalClient.translatePath as jest.Mock).mockResolvedValue(mockPathInfo)
    ;(queries.getData as jest.Mock).mockResolvedValue(mockResource)
    ;(getGlobalElements as jest.Mock).mockResolvedValue(mockGlobalElements)
  })

  it('renders successfully with valid params', async () => {
    const params = { slug: ['test-path'] }

    // Since this is an async component, we need to await it
    const PageComponent = await ResourcePage({ params })

    render(PageComponent)

    // Verify the path was translated
    expect(drupalClient.translatePath).toHaveBeenCalledWith('/test-path')

    // Verify the resource was fetched
    expect(queries.getData).toHaveBeenCalledWith('node--event', {
      id: 'test-uuid-123',
      context: {
        preview: false,
        params: { slug: ['test-path'] },
      },
    })

    // Verify global elements were fetched
    expect(getGlobalElements).toHaveBeenCalledWith('/test-path')
  })

  it('calls notFound when path translation fails', async () => {
    const params = { slug: ['invalid-path'] }

    ;(drupalClient.translatePath as jest.Mock).mockRejectedValue(
      new Error('Path not found')
    )

    await ResourcePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  it('calls notFound when pathInfo is null', async () => {
    const params = { slug: ['test-path'] }

    ;(drupalClient.translatePath as jest.Mock).mockResolvedValue(null)

    await ResourcePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  it('calls notFound when resource fetch fails', async () => {
    const params = { slug: ['test-path'] }

    ;(queries.getData as jest.Mock).mockRejectedValue(
      new Error('Resource not found')
    )

    await ResourcePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  it('handles preview mode correctly', async () => {
    const params = { slug: ['test-path'] }
    const mockPreviewDraftMode = { isEnabled: true }

    ;(draftMode as jest.Mock).mockReturnValue(mockPreviewDraftMode)

    await ResourcePage({ params })

    // Should use translatePathFromContext for preview mode
    expect(drupalClient.translatePathFromContext).toHaveBeenCalledWith({
      params: { slug: ['test-path'] },
      preview: true,
      previewData: {},
    })
  })

  it('handles root path correctly', async () => {
    const params = { slug: undefined }

    await ResourcePage({ params })

    expect(drupalClient.translatePath).toHaveBeenCalledWith('/')
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DownloadableFile } from './template'
import { DownloadableFile as FormattedDownloadableFile } from './formatted-type'

describe('DownloadableFile Component', () => {
  const getMockDownloadableFileData = (
    overrides: Partial<FormattedDownloadableFile> = {}
  ): FormattedDownloadableFile => ({
    id: 'test-id',
    entityId: 12345,
    type: 'paragraph--downloadable_file',
    title: 'Test File',
    mediaType: 'document',
    url: 'https://example.com/test.pdf',
    extension: 'PDF',
    ...overrides,
  })

  test('renders document media with download link', () => {
    const mockData = getMockDownloadableFileData({
      mediaType: 'document',
      title: 'Test Document',
      url: 'https://example.com/document.pdf',
      extension: 'PDF',
    })

    const { container } = render(<DownloadableFile {...mockData} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toBeInTheDocument()
    expect(vaLink).toHaveAttribute('href', 'https://example.com/document.pdf')
    expect(vaLink).toHaveAttribute(
      'download',
      'https://example.com/document.pdf'
    )
    expect(vaLink).toHaveAttribute('text', 'Test Document (PDF)')
  })

  test('renders image media with download link', () => {
    const mockData = getMockDownloadableFileData({
      mediaType: 'image',
      title: 'Test Image',
      url: 'https://example.com/image.png',
      extension: 'PNG',
    })

    const { container } = render(<DownloadableFile {...mockData} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toBeInTheDocument()
    expect(vaLink).toHaveAttribute('href', 'https://example.com/image.png')
    expect(vaLink).toHaveAttribute('download', 'https://example.com/image.png')
    expect(vaLink).toHaveAttribute('text', 'Test Image (PNG)')
  })

  test('renders video media with YouTube icon and link', () => {
    const mockData = getMockDownloadableFileData({
      mediaType: 'video',
      title: 'Test Video',
      url: 'https://www.youtube.com/watch?v=test123',
      extension: undefined,
    })

    const { container } = render(<DownloadableFile {...mockData} />)

    // Check for YouTube icon
    const vaIcon = container.querySelector('va-icon')
    expect(vaIcon).toBeInTheDocument()
    expect(vaIcon).toHaveClass('vads-u-color--link-default')
    expect(vaIcon).toHaveAttribute('icon', 'youtube')
    expect(vaIcon).toHaveAttribute('size', '3')

    // Check for video link (without download attribute)
    const vaLink = container.querySelector('va-link')
    expect(vaLink).toBeInTheDocument()
    expect(vaLink).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=test123'
    )
    expect(vaLink).not.toHaveAttribute('download')
    expect(vaLink).toHaveAttribute('text', 'Test Video')
  })

  test('renders nothing for unknown media type', () => {
    const mockData = getMockDownloadableFileData({
      // @ts-expect-error - unknown media type
      mediaType: 'unknown',
    })

    const { container } = render(<DownloadableFile {...mockData} />)

    // Should render the container div but no content
    expect(container.firstChild).toBeInTheDocument()
    expect(container.querySelector('va-link')).not.toBeInTheDocument()
    expect(container.querySelector('va-icon')).not.toBeInTheDocument()
  })
})

import { render, screen, axe } from 'test-utils'
import { AssetCard } from './AssetCard'
import { MediaResourceType } from '@/types/drupal/media'
import type { OutreachAsset, OutreachTopic } from './formatted-type'

describe('AssetCard', () => {
  const mockTopics: OutreachTopic[] = [
    { topicId: 'healthcare', name: 'Health Care' },
    { topicId: 'education', name: 'Education' },
    { topicId: 'general', name: 'General' },
  ]

  describe('Document media type', () => {
    const documentAsset: OutreachAsset = {
      id: '1',
      title: 'Test Document Title',
      description: 'This is a test document description',
      format: 'PDF',
      categories: ['healthcare'],
      media: {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/document.pdf',
        documentFilesize: 1024000,
      },
    }

    test('renders document card with topic illustration', async () => {
      const { container } = render(
        <AssetCard asset={documentAsset} topics={mockTopics} />
      )

      expect(screen.getByText('Health Care')).toBeInTheDocument()
      expect(screen.getByText('Test Document Title')).toBeInTheDocument()
      expect(
        screen.getByText('This is a test document description')
      ).toBeInTheDocument()

      const image = container.querySelector('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'Test Document Title')
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('health-care.png')
      )

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('uses default topic illustration when category not found', () => {
      const assetWithUnknownCategory: OutreachAsset = {
        ...documentAsset,
        categories: ['unknown'],
      }
      const { container } = render(
        <AssetCard asset={assetWithUnknownCategory} topics={mockTopics} />
      )

      const image = container.querySelector('img')
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('records.png')
      )
    })

    test('truncates long title', () => {
      const assetWithLongTitle: OutreachAsset = {
        ...documentAsset,
        title:
          'This is a very long title that should be truncated because it exceeds 36 characters',
      }
      render(<AssetCard asset={assetWithLongTitle} topics={mockTopics} />)

      const title = screen.getByText(/This is a very long title that shoul/)
      expect(title.textContent).toContain('...')
      expect(title.textContent?.length).toBeLessThanOrEqual(39) // 36 + '...'
    })

    test('truncates long description', () => {
      const assetWithLongDescription: OutreachAsset = {
        ...documentAsset,
        description:
          'This is a very long description that should be truncated because it exceeds 81 characters and needs to be cut off',
      }
      render(<AssetCard asset={assetWithLongDescription} topics={mockTopics} />)

      const description = screen.getByText(
        /This is a very long description that should be truncated/
      )
      expect(description.textContent).toContain('...')
      expect(description.textContent?.length).toBeLessThanOrEqual(84) // 81 + '...'
    })
  })

  describe('Image media type', () => {
    const imageAsset: OutreachAsset = {
      id: '2',
      title: 'Test Image Title',
      description: 'This is a test image description',
      format: 'JPG',
      categories: ['education'],
      media: {
        type: MediaResourceType.Image,
        imageUrl: 'https://example.com/image.jpg',
        imageAlt: 'Test image alt text',
        imageFilesize: 512000,
      },
    }

    test('renders image card with actual image', async () => {
      const { container } = render(
        <AssetCard asset={imageAsset} topics={mockTopics} />
      )

      expect(screen.getByText('Education')).toBeInTheDocument()
      expect(screen.getByText('Test Image Title')).toBeInTheDocument()

      const image = container.querySelector('img')
      expect(image).toBeInTheDocument()
      // TypeScript: we know this is Image media type from test setup
      const imageMedia = imageAsset.media as Extract<
        typeof imageAsset.media,
        { type: MediaResourceType.Image }
      >
      expect(image).toHaveAttribute('src', imageMedia.imageUrl)
      expect(image).toHaveAttribute('alt', 'Test image alt text')

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('uses absoluteUrl when provided', () => {
      const assetWithAbsoluteUrl: OutreachAsset = {
        ...imageAsset,
        absoluteUrl: 'https://example.com/absolute/image.jpg',
      }
      const { container } = render(
        <AssetCard asset={assetWithAbsoluteUrl} topics={mockTopics} />
      )

      const image = container.querySelector('img')
      expect(image).toHaveAttribute(
        'src',
        'https://example.com/absolute/image.jpg'
      )
    })

    test('uses title as alt text when imageAlt is not available', () => {
      const assetWithoutAlt: OutreachAsset = {
        ...imageAsset,
        media: {
          type: MediaResourceType.Image,
          imageUrl:
            imageAsset.media.type === MediaResourceType.Image
              ? imageAsset.media.imageUrl
              : '',
          imageAlt: '',
          imageFilesize:
            imageAsset.media.type === MediaResourceType.Image
              ? imageAsset.media.imageFilesize
              : 0,
        },
      }
      const { container } = render(
        <AssetCard asset={assetWithoutAlt} topics={mockTopics} />
      )

      const image = container.querySelector('img')
      expect(image).toHaveAttribute('alt', 'Test Image Title')
    })
  })

  describe('Video media type', () => {
    const videoAsset: OutreachAsset = {
      id: '3',
      title: 'Test Video Title',
      description: 'This is a test video description',
      format: 'Video',
      categories: ['general'],
      media: {
        type: MediaResourceType.Video,
        videoEmbedUrl: 'https://www.youtube.com/embed?v=abc123',
        videoThumbnailUrl: 'https://example.com/thumbnail.jpg',
      },
    }

    test('renders video card with thumbnail', async () => {
      const { container } = render(
        <AssetCard asset={videoAsset} topics={mockTopics} />
      )

      expect(screen.getByText('General')).toBeInTheDocument()
      expect(screen.getByText('Test Video Title')).toBeInTheDocument()

      const image = container.querySelector('img')
      expect(image).toBeInTheDocument()
      // TypeScript: we know this is Video media type from test setup
      const videoMedia = videoAsset.media as Extract<
        typeof videoAsset.media,
        { type: MediaResourceType.Video }
      >
      expect(image).toHaveAttribute('src', videoMedia.videoThumbnailUrl)
      expect(image).toHaveAttribute('alt', 'Test Video Title')

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('uses YouTube thumbnail when videoThumbnailUrl is not available', () => {
      const assetWithoutThumbnail: OutreachAsset = {
        ...videoAsset,
        media: {
          type: MediaResourceType.Video,
          videoEmbedUrl:
            videoAsset.media.type === MediaResourceType.Video
              ? videoAsset.media.videoEmbedUrl
              : '',
          videoThumbnailUrl: '',
        },
      }
      const { container } = render(
        <AssetCard asset={assetWithoutThumbnail} topics={mockTopics} />
      )

      const image = container.querySelector('img')
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('img.youtube.com')
      )
    })

    test('handles non-YouTube video without thumbnail gracefully', () => {
      // Simulate a non-YouTube video (e.g., Vimeo) without a thumbnail URL
      // Using a URL format that won't match YouTube patterns in getYouTubeThumbnail
      // The URL needs to not have a video ID in the pathname or query params
      const assetWithoutThumbnail: OutreachAsset = {
        ...videoAsset,
        media: {
          type: MediaResourceType.Video,
          videoEmbedUrl: 'https://player.vimeo.com/video/',
          videoThumbnailUrl: '',
        },
      }
      const { container } = render(
        <AssetCard asset={assetWithoutThumbnail} topics={mockTopics} />
      )

      const image = container.querySelector('img')
      // When thumbnail is missing and it's not a YouTube video, component falls back to topic-based illustration
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('records.png')
      )
    })
  })

  describe('Edge cases', () => {
    test('handles empty categories array', () => {
      const assetNoCategories: OutreachAsset = {
        id: '4',
        title: 'Test Asset',
        description: 'Test description',
        format: 'PDF',
        categories: [],
        media: {
          type: MediaResourceType.Document,
          documentUrl: 'https://example.com/document.pdf',
          documentFilesize: 1024000,
        },
      }
      const { container } = render(
        <AssetCard asset={assetNoCategories} topics={mockTopics} />
      )

      // Should not crash and should use default illustration
      const image = container.querySelector('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('records.png')
      )
    })

    test('handles missing category topic', () => {
      const assetWithMissingTopic: OutreachAsset = {
        id: '5',
        title: 'Test Asset',
        description: 'Test description',
        format: 'PDF',
        categories: ['nonexistent'],
        media: {
          type: MediaResourceType.Document,
          documentUrl: 'https://example.com/document.pdf',
          documentFilesize: 1024000,
        },
      }
      const { container } = render(
        <AssetCard asset={assetWithMissingTopic} topics={mockTopics} />
      )

      // Should not crash
      expect(screen.getByText('Test Asset')).toBeInTheDocument()
    })

    test('renders DownloadLink component', () => {
      const documentAsset: OutreachAsset = {
        id: '6',
        title: 'Test Document',
        description: 'Test description',
        format: 'PDF',
        categories: ['healthcare'],
        media: {
          type: MediaResourceType.Document,
          documentUrl: 'https://example.com/document.pdf',
          documentFilesize: 1024000,
        },
        fileSize: 2048000,
      }
      const { container } = render(
        <AssetCard asset={documentAsset} topics={mockTopics} />
      )

      const downloadLink = container.querySelector('va-link')
      expect(downloadLink).toBeInTheDocument()
      expect(downloadLink).toHaveAttribute(
        'text',
        expect.stringContaining('Download PDF')
      )
    })

    test('passes fileSize to DownloadLink', () => {
      const documentAsset: OutreachAsset = {
        id: '7',
        title: 'Test Document',
        description: 'Test description',
        format: 'PDF',
        categories: ['healthcare'],
        media: {
          type: MediaResourceType.Document,
          documentUrl: 'https://example.com/document.pdf',
          documentFilesize: 0,
        },
        fileSize: 3072000,
      }
      const { container } = render(
        <AssetCard asset={documentAsset} topics={mockTopics} />
      )

      const downloadLink = container.querySelector('va-link')
      expect(downloadLink).toHaveAttribute(
        'text',
        expect.stringContaining('3.07MB')
      )
    })
  })

  describe('Layout and styling', () => {
    const documentAsset: OutreachAsset = {
      id: '8',
      title: 'Test Document',
      description: 'Test description',
      format: 'PDF',
      categories: ['healthcare'],
      media: {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/document.pdf',
        documentFilesize: 1024000,
      },
    }

    test('applies correct CSS classes', () => {
      const { container } = render(
        <AssetCard asset={documentAsset} topics={mockTopics} />
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('vads-grid-col-12')
      expect(card).toHaveClass('tablet:vads-grid-col-6')
    })

    test('renders category name in italics', () => {
      const { container } = render(
        <AssetCard asset={documentAsset} topics={mockTopics} />
      )

      const categoryElement = screen.getByText('Health Care')
      expect(categoryElement.tagName).toBe('I')
    })

    test('renders title as h2', () => {
      const { container } = render(
        <AssetCard asset={documentAsset} topics={mockTopics} />
      )

      const title = screen.getByText('Test Document')
      expect(title.tagName).toBe('H2')
    })
  })
})

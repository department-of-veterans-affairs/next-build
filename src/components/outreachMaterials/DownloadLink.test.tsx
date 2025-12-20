import { render, screen, axe } from 'test-utils'
import { DownloadLink } from './DownloadLink'
import { MediaResourceType } from '@/types/drupal/media'
import type { OutreachAssetMedia } from './formatted-type'

describe('DownloadLink', () => {
  describe('Document media type', () => {
    const documentMedia: OutreachAssetMedia = {
      type: MediaResourceType.Document,
      documentUrl: 'https://example.com/document.pdf',
      documentFilesize: 1024000,
    }

    test('renders download link with file extension and size', async () => {
      const { container } = render(<DownloadLink media={documentMedia} />)

      const link = container.querySelector('va-link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', documentMedia.documentUrl)
      expect(link).toHaveAttribute('download', '')
      expect(link).toHaveAttribute('text', 'Download PDF (1.02MB)')

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('uses absoluteUrl when provided', () => {
      const absoluteUrl = 'https://example.com/absolute/document.pdf'
      const { container } = render(
        <DownloadLink media={documentMedia} absoluteUrl={absoluteUrl} />
      )

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('href', absoluteUrl)
    })

    test('uses fileSize prop when documentFilesize is not available', () => {
      const mediaWithoutSize: OutreachAssetMedia = {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/document.pdf',
        documentFilesize: 0,
      }
      const { container } = render(
        <DownloadLink media={mediaWithoutSize} fileSize={2048000} />
      )

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('text', 'Download PDF (2.05MB)')
    })

    test('renders without size when filesize is not available', () => {
      const mediaWithoutSize: OutreachAssetMedia = {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/document.pdf',
        documentFilesize: 0,
      }
      const { container } = render(<DownloadLink media={mediaWithoutSize} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('text', 'Download PDF')
    })

    test('handles different file extensions', () => {
      const docxMedia: OutreachAssetMedia = {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/document.docx',
        documentFilesize: 512000,
      }
      const { container } = render(<DownloadLink media={docxMedia} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('text', 'Download DOCX (0.51MB)')
    })

    test('handles URL without extension', () => {
      const mediaNoExt: OutreachAssetMedia = {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/document',
        documentFilesize: 1024000,
      }
      const { container } = render(<DownloadLink media={mediaNoExt} />)

      const link = container.querySelector('va-link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('text', expect.stringContaining('Download'))
    })
  })

  describe('Image media type', () => {
    const imageMedia: OutreachAssetMedia = {
      type: MediaResourceType.Image,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Test image',
      imageFilesize: 512000,
    }

    test('renders download link with file extension and size', async () => {
      const { container } = render(<DownloadLink media={imageMedia} />)

      const link = container.querySelector('va-link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', imageMedia.imageUrl)
      expect(link).toHaveAttribute('download', imageMedia.imageUrl)
      expect(link).toHaveAttribute('text', 'Download JPG (0.51MB)')

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('uses absoluteUrl when provided', () => {
      const absoluteUrl = 'https://example.com/absolute/image.jpg'
      const { container } = render(
        <DownloadLink media={imageMedia} absoluteUrl={absoluteUrl} />
      )

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('href', absoluteUrl)
      expect(link).toHaveAttribute('download', absoluteUrl)
    })

    test('uses fileSize prop when imageFilesize is not available', () => {
      const mediaWithoutSize: OutreachAssetMedia = {
        type: MediaResourceType.Image,
        imageUrl: 'https://example.com/image.jpg',
        imageAlt: 'Test image',
        imageFilesize: 0,
      }
      const { container } = render(
        <DownloadLink media={mediaWithoutSize} fileSize={1536000} />
      )

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('text', 'Download JPG (1.54MB)')
    })

    test('renders without size when filesize is not available', () => {
      const mediaWithoutSize: OutreachAssetMedia = {
        type: MediaResourceType.Image,
        imageUrl: 'https://example.com/image.jpg',
        imageAlt: 'Test image',
        imageFilesize: 0,
      }
      const { container } = render(<DownloadLink media={mediaWithoutSize} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('text', 'Download JPG')
    })

    test('handles different image formats', () => {
      const pngMedia: OutreachAssetMedia = {
        type: MediaResourceType.Image,
        imageUrl: 'https://example.com/image.png',
        imageAlt: 'PNG image',
        imageFilesize: 256000,
      }
      const { container } = render(<DownloadLink media={pngMedia} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('text', 'Download PNG (0.26MB)')
    })
  })

  describe('Video media type', () => {
    const videoMedia: OutreachAssetMedia = {
      type: MediaResourceType.Video,
      videoEmbedUrl: 'https://www.youtube.com/embed?v=abc123',
      videoThumbnailUrl: 'https://example.com/thumbnail.jpg',
    }

    test('renders YouTube icon and link', async () => {
      const { container } = render(<DownloadLink media={videoMedia} />)

      const icon = container.querySelector('va-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('icon', 'youtube')
      expect(icon).toHaveAttribute('size', '3')

      const link = container.querySelector('va-link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', videoMedia.videoEmbedUrl)
      expect(link).toHaveAttribute('text', 'Go to video')

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('handles empty video embed URL', () => {
      const mediaWithEmptyUrl: OutreachAssetMedia = {
        type: MediaResourceType.Video,
        videoEmbedUrl: '',
        videoThumbnailUrl: '',
      }
      const { container } = render(<DownloadLink media={mediaWithEmptyUrl} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('href', '')
      expect(link).toHaveAttribute('text', 'Go to video')
    })
  })

  describe('Edge cases', () => {
    test('returns null for unknown media type', () => {
      const { container } = render(
        <DownloadLink media={{} as OutreachAssetMedia} />
      )
      expect(container).toBeEmptyDOMElement()
    })

    test('handles empty document URL', () => {
      const mediaWithEmptyUrl: OutreachAssetMedia = {
        type: MediaResourceType.Document,
        documentUrl: '',
        documentFilesize: 0,
      }
      const { container } = render(<DownloadLink media={mediaWithEmptyUrl} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('href', '')
      expect(link).toHaveAttribute('text', 'Download ')
    })

    test('handles empty image URL', () => {
      const mediaWithEmptyUrl: OutreachAssetMedia = {
        type: MediaResourceType.Image,
        imageUrl: '',
        imageAlt: '',
        imageFilesize: 0,
      }
      const { container } = render(<DownloadLink media={mediaWithEmptyUrl} />)

      const link = container.querySelector('va-link')
      expect(link).toHaveAttribute('href', '')
      expect(link).toHaveAttribute('text', 'Download ')
    })
  })
})

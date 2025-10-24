import { render, screen } from '@testing-library/react'
import { Media } from './template'
import { Media as FormattedMedia } from './formatted-type'

describe('Media Component', () => {
  const mockMediaData: FormattedMedia = {
    type: 'paragraph--media',
    id: 'bc5d91c0-ae80-4b24-a942-e2c3688bbe8d',
    entityId: 183009,
    image: {
      url: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/2025-10/my-image.png',
      alt: 'Rating sandwiches',
      title: 'Test Image Title',
    },
    allowClicksOnThisImage: true,
  }

  it('renders correctly with valid props', () => {
    render(<Media {...mockMediaData} />)

    // Check main container
    const container = document.querySelector(
      '[data-template="paragraphs/media"]'
    )
    expect(container).toBeInTheDocument()
    expect(container).toHaveAttribute('data-entity-id', '183009')

    // Check image
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockMediaData.image.url)
    expect(image).toHaveAttribute('alt', mockMediaData.image.alt)
    expect(image).toHaveAttribute('title', mockMediaData.image.title)
  })

  it('renders expand button when allowClicksOnThisImage is true', () => {
    render(<Media {...mockMediaData} />)

    const expandButton = screen.getByLabelText('Open image in new tab')
    expect(expandButton).toBeInTheDocument()
    expect(expandButton).toHaveAttribute('href', mockMediaData.image.url)
    expect(expandButton).toHaveAttribute('target', '_blank')

    // Check for va-icon
    const icon = expandButton.querySelector('va-icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('icon', 'zoom_out_map')
    expect(icon).toHaveAttribute('size', '3')
  })

  it('does not render expand button when allowClicksOnThisImage is false', () => {
    const dataWithoutClicks = {
      ...mockMediaData,
      allowClicksOnThisImage: false,
    }

    render(<Media {...dataWithoutClicks} />)

    const expandButton = screen.queryByLabelText('Open image in new tab')
    expect(expandButton).not.toBeInTheDocument()

    // Image should still be present
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('handles null title gracefully', () => {
    const dataWithNullTitle = {
      ...mockMediaData,
      image: {
        ...mockMediaData.image,
        title: null,
      },
    }

    render(<Media {...dataWithNullTitle} />)

    const image = screen.getByRole('img')
    expect(image).not.toHaveAttribute('title')
  })
})

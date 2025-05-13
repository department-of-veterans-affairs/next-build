import { render, screen, waitFor } from '@testing-library/react'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import { MediaImage } from '@/templates/common/mediaImage'

const mediaImage: FormattedMediaImage = {
  id: '3',
  alt: 'Smiling man in glasses.',
  title: 'Cats or Dogs?',
  width: 1299,
  height: 1512,
  links: {
    '2_1_large': {
      href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
      meta: {
        linkParams: {
          width: 100,
          height: 100,
        },
      },
    },
  },
}

describe('Media Image component renders', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImage {...mediaImage} imageStyle="2_1_large" />)
    waitFor(() => expect(screen.getByText('Cats or Dogs?')).toBeInTheDocument())
  })

  test('<MediaImage> renders with new title', () => {
    mediaImage.title = 'COVID-19 vaccines'
    render(
      <MediaImage key={mediaImage.id} {...mediaImage} imageStyle="2_1_large" />
    )
    waitFor(() =>
      expect(screen.getByText('COVID-19 vaccines')).toBeInTheDocument()
    )
  })

  test('MediaImage renders with correct alt text', () => {
    render(
      <MediaImage key={mediaImage.id} {...mediaImage} imageStyle="2_1_large" />
    )
    const imgElement = document.querySelector('img[alt=""]')
    // Loading element
    waitFor(() => expect(imgElement).toHaveAttribute('alt', ''))
    waitFor(() =>
      expect(screen.getByText('Smiling man in glasses.')).toBeInTheDocument()
    )
  })
})

describe('MediaImage component returns null', () => {
  test('returns null when imageStyle is not provided', () => {
    const { container } = render(<MediaImage {...mediaImage} />)
    expect(container.firstChild).toBeNull()
  })

  test('returns null when imageStyle does not exist', () => {
    const { container } = render(
      <MediaImage {...mediaImage} imageStyle="non_existent_style" />
    )
    expect(container.firstChild).toBeNull()
  })

  test('returns null when links is null', () => {
    const imageWithNullLinks = { ...mediaImage, links: null }
    const { container } = render(
      <MediaImage {...imageWithNullLinks} imageStyle="2_1_large" />
    )
    expect(container.firstChild).toBeNull()
  })

  test('returns null when links is undefined', () => {
    const imageWithUndefinedLinks = { ...mediaImage, links: undefined }
    const { container } = render(
      <MediaImage {...imageWithUndefinedLinks} imageStyle="2_1_large" />
    )
    expect(container.firstChild).toBeNull()
  })

  test('returns null when href is missing for imageStyle', () => {
    const imageWithoutHref = {
      ...mediaImage,
      links: {
        '2_1_large': {
          href: '',
          meta: {
            linkParams: {},
          },
        },
      },
    }
    const { container } = render(
      <MediaImage {...imageWithoutHref} imageStyle="2_1_large" />
    )
    expect(container.firstChild).toBeNull()
  })

  test('returns null when alt text is missing', () => {
    const { container } = render(
      <MediaImage {...mediaImage} alt={null} imageStyle="2_1_large" />
    )
    expect(container.firstChild).toBeNull()
  })

  test('renders presentation images when alt text is missing', () => {
    render(<MediaImage {...mediaImage} alt="" imageStyle="2_1_large" />)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })
})

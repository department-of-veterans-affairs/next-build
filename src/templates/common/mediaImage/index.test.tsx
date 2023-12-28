import { render, screen, waitFor } from '@testing-library/react'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import { MediaImage } from '@/templates/common/mediaImage'

const mediaImage: FormattedMediaImage = {
  id: '3',
  alt: 'Smiling man in glasses.',
  title: 'Cats or Dogs?',
  width: 1299,
  height: 1512,
  url: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
  link: {
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
    render(<MediaImage {...mediaImage} />)
    waitFor(() => expect(screen.getByText('Cats or Dogs?')).toBeInTheDocument())
  })

  test('<MediaImage> renders with new title', () => {
    mediaImage.title = 'COVID-19 vaccines'
    render(<MediaImage key={mediaImage.id} {...mediaImage} />)
    waitFor(() =>
      expect(screen.getByText('COVID-19 vaccines')).toBeInTheDocument()
    )
  })

  test('MediaImage renders with correct alt text', () => {
    render(<MediaImage key={mediaImage.id} {...mediaImage} />)
    const imgElement = document.querySelector('img[alt=""]')
    // Loading element
    waitFor(() => expect(imgElement).toHaveAttribute('alt', ''))
    waitFor(() =>
      expect(screen.getByText('Smiling man in glasses.')).toBeInTheDocument()
    )
  })

  test('MediaImage renders when image style is defined', () => {
    render(
      <MediaImage
        key={mediaImage.id}
        {...mediaImage}
        imageStyle="1_1_square_medium_thumbnail"
      />
    )
    waitFor(() => expect(screen.getByText('1_1_small')).toBeInTheDocument())
  })

  test('MediaImage renders when the image style is not defined', () => {
    mediaImage.imageStyle = null
    render(
      <MediaImage
        key={mediaImage.id}
        {...mediaImage}
        imageStyle={mediaImage.imageStyle}
      />
    )
    waitFor(() =>
      expect(screen.getByText('Smiling man in glasses.')).toBeInTheDocument()
    )
  })

  test('MediaImage does not render with null data', () => {
    mediaImage.link = null
    render(<MediaImage key={mediaImage.id} {...mediaImage} />)
    waitFor(() =>
      expect(
        screen.getByText('Smiling man in glasses.')
      ).not.toBeInTheDocument()
    )
  })
})

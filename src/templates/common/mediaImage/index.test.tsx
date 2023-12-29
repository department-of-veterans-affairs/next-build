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

describe('MediaImage component does not render', () => {
  let spyConsoleError

  beforeEach(() => {
    spyConsoleError = jest.spyOn(console, 'error')
    spyConsoleError.mockImplementation(() => null)
  })

  afterEach(() => {
    spyConsoleError.mockRestore()
  })

  const expectMissingSrc = () => {
    expect(spyConsoleError).toHaveBeenCalledWith(
      expect.stringMatching(/Image is missing required "src" property/),
      expect.any(Object)
    )
  }

  test('MediaImage throws error when imageStyle is not provided', () => {
    render(<MediaImage key={mediaImage.id} {...mediaImage} />)
    expect(spyConsoleError).toHaveBeenCalledWith(
      expect.stringMatching(/Image is missing required "src" property/),
      expect.any(Object)
    )
  })

  test('MediaImage throws error when imageStyle does not exist', () => {
    render(
      <MediaImage
        key={mediaImage.id}
        {...mediaImage}
        imageStyle="non_existent_style"
      />
    )
    expect(spyConsoleError).toHaveBeenCalledWith(
      expect.stringMatching(/Image is missing required "src" property/),
      expect.any(Object)
    )
  })

  // test('MediaImage throws error with null data', async () => {
  //   mediaImage.links = null
  //   render(<MediaImage key={mediaImage.id} {...mediaImage} />)
  // })
})

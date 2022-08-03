import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageComponent, MediaImageProps } from '.'

// Language: typescript
// Path: src/components/media/index.test.tsx

const data: MediaImageProps = {
  image: {
    url: 'https://www.example.com/image.jpg',
    width: 100,
    height: 100,
    alt: 'pension',
    title: 'title',
    styles: {},
  },
  imageStyle: 'string',
}

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImageComponent {...data} imageStyle="full_content_width" />)
    expect(screen.getByAltText('pension')).toBeInTheDocument()
  })
})

describe('Media Image renders correct image imageStyle prop', () => {
  test('<MediaImage> does not render', () => {
    render(<MediaImageComponent image={null} imageStyle="full_content_width" />)
    expect(screen.queryByAltText('pension')).not.toBeInTheDocument()
  })

  test('MediaImage renders with no image style', () => {
    render(<MediaImageComponent {...data} imageStyle={null} />)
    expect(screen.queryByAltText('pension')).toBeInTheDocument()
  })

  test('MediaImage renders with large image', () => {
    render(<MediaImageComponent {...data} imageStyle="large" />)
    expect(screen.queryByAltText('pension')).toBeInTheDocument()
  })
})

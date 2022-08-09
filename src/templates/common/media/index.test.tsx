import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageComponent, MediaImageProps } from '.'
import { mediaImageDataService } from './dataService'
import mediaImage from './mockMedia.json'
// Language: typescript
// Path: src/components/media/index.test.tsx
const image = mediaImageDataService(mediaImage, 'full_content_width')

let data: MediaImageProps = {
  id: image.id,
  url: image.url,
  width: image.width,
  height: image.height,
  alt: image.alt,
  title: image.title,
  styles: image.styles,
  imageStyle: null,
}

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImageComponent {...data} />)
    expect(screen.getByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage renders with large image', () => {
    render(<MediaImageComponent {...data} imageStyle="large" />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage renders when image style is defined', () => {
    data.imageStyle = null
    render(<MediaImageComponent {...data} />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage does not render with null data', () => {
    data = null
    render(<MediaImageComponent {...data} />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).not.toBeInTheDocument()
  })
})

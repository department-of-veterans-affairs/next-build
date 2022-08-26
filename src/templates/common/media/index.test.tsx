import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageType } from '@/types/index'
import { MediaImageComponent } from '.'

const mediaImage: MediaImageType = {
  id: '1',
  alt: 'Dr. Brooke Decker ',
  title: 'test',
  url: 'https://picsum.photos/200/300',
  width: '23',
  height: '23',
  link: [
    {
      href: 'https://picsum.photos/200/300',
      width: '23',
      height: '23',
    },
  ],
  imageStyle: '1_1_square_medium_thumbnail',
  className: 'test',
}
// Language: typescript
// Path: src/components/media/index.test.tsx

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImageComponent {...mediaImage} imageStyle="2_1_large" />)
    expect(screen.getByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage renders with large image', () => {
    render(<MediaImageComponent {...mediaImage} imageStyle="2_1_large" />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage renders when image style is defined', () => {
    render(
      <MediaImageComponent {...mediaImage} imageStyle={mediaImage.imageStyle} />
    )
    expect(screen.queryByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage does not render with null data', () => {
    mediaImage[0] = null
    render(<MediaImageComponent {...mediaImage[0]} imageStyle="2_1_large" />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).not.toBeInTheDocument()
  })
})

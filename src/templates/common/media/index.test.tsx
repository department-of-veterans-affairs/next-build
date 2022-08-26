import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageType } from '@/types/index'
import { MediaImageComponent } from '.'

const mediaImage: MediaImageType = {
  id: '1',
  alt: 'Dr. Brooke Decker ',
  title: 'test',
  url: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
  width: 23,
  height: 23,
  link: [
    {
      href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
      width: 23,
      height: 23,
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

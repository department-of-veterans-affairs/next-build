import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageType } from '@/types/index'
import Image from '../image'

// Language: typescript
// Path: src/components/media/index.test.tsx

const mediaImage: MediaImageType = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  link: {
    href: 'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/2_1_large/public/2020-08/Raab.jpg?h=d3381009',
    meta: {
      linkParams: {
        width: 100,
        height: 100,
      },
    },
  },

  alt: 'Smiling man in glasses.',
  title: '',
  width: 1299,
  height: 1512,
  url: '/sites/default/files/2020-08/Raab.jpg',
}

function MediaImageComponent({ imageStyle }: MediaImageType) {
  return (
    <div className={imageStyle}>
      <Image
        id={mediaImage.id}
        alt={mediaImage.alt}
        title={mediaImage.title}
        className="sub"
        width={100}
        height={100}
        src={mediaImage.url}
      />
    </div>
  )
}

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImageComponent {...mediaImage} />)
    expect(screen.getByAltText('Smiling man in glasses.')).toBeInTheDocument()
  })
  test('MediaImage renders with large image', () => {
    render(<MediaImageComponent {...mediaImage} imageStyle="2_1_large" />)
    expect(screen.queryByAltText('Smiling man in glasses.')).toBeInTheDocument()
  })
  test('MediaImage renders when image style is defined', () => {
    render(
      <MediaImageComponent {...mediaImage} imageStyle={mediaImage.imageStyle} />
    )
    expect(screen.queryByAltText('Smiling man in glasses.')).toBeInTheDocument()
  })
  test('MediaImage does not render with null data', () => {
    mediaImage.alt = null
    render(<MediaImageComponent {...mediaImage[0]} imageStyle="2_1_large" />)
    expect(
      screen.queryByAltText('Smiling man in glasses.')
    ).not.toBeInTheDocument()
  })
})

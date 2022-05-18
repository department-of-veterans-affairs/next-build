import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageComponent } from '.'

// Language: typescript
// Path: src/components/media/index.test.tsx

const data = {
  media: {
    type: 'media--image',
    url: 'https://www.example.com/image.jpg',
    id: '1',
    imageStyle: 'string',
    image: {
      uri: {
        url: 'https://www.example.com/image.jpg',
      },
      resourceIdObjMeta: {
        alt: 'pension',
        height: '100',
        title: 'title',
        width: '100',
      },
      links: {
        '1_1_square_medium_thumbnail': {
          href: 'https://www.example.com/image.jpg',
          meta: {
            height: '100',
            width: '100',
          },
        },
      },
    },
  },
}

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(
      <MediaImageComponent
        image={data?.media}
        imageStyle="full_content_width"
      />
    )
    expect(screen.getByAltText('pension')).toBeInTheDocument()
  })
})

describe('Media Image renders correct image imageStyle prop', () => {
  test('<MediaImage> does not render', () => {
    render(<MediaImageComponent image={null} imageStyle="full_content_width" />)
    expect(screen.queryByAltText('pension')).not.toBeInTheDocument()
  })

  test('MediaImage renders with no image style', () => {
    render(<MediaImageComponent image={data?.media} imageStyle={null} />)
    expect(screen.queryByAltText('pension')).toBeInTheDocument()
  })

  test('MediaImage renders with large image', () => {
    render(<MediaImageComponent image={data?.media} imageStyle="large" />)
    expect(screen.queryByAltText('pension')).toBeInTheDocument()
  })
})

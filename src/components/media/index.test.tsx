import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImage } from '.'

// Language: typescript
// Path: src/components/media/index.test.tsx

const media = {
  image: {
    uri: {
      url: '/sites/default/files/hub_promos/pension.png',
    },
    links: {
      full_content_width: {
        href: 'https://prod.cms.va.gov/sites/default/files/styles/full_content_width/public/hub_promos/pension.png',
        meta: {
          height: '304',
          width: '456',
        },
      },
      large: {
        href: 'https://prod.cms.va.gov/sites/default/files/styles/large/public/hub_promos/pension.png',
        meta: {
          height: '304',
          width: '456',
        },
      },
    },
    resourceIdObjMeta: {
      alt: 'pension',
      title: 'pension',
      height: '304',
      width: '456',
    },
  },
  drupal_internal__mid: 'string',
  drupal_internal__vid: 'string',
  changed: 'string',
  created: 'string',
  name: 'string',
  id: 'string',
  type: 'string',
  langcode: 'string',
  status: true,
}

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImage media={media} imageStyle="full_content_width" />)
    expect(screen.getByAltText('pension')).toBeInTheDocument()
  })
})

describe('Media Image renders correct image imageStyle prop', () => {
  test('<MediaImage> does not render', () => {
    render(<MediaImage media={null} imageStyle="full_content_width" />)
    expect(screen.queryByAltText('pension')).not.toBeInTheDocument()
  })

  test('MediaImage renders with no image style', () => {
    render(<MediaImage media={media} imageStyle={null} />)
    expect(screen.queryByAltText('pension')).toBeInTheDocument()
  })

  test('MediaImage renders with large image', () => {
    render(<MediaImage media={media} imageStyle="large" />)
    expect(screen.queryByAltText('pension')).toBeInTheDocument()
  })
})

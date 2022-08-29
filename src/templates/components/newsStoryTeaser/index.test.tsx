import { render, screen } from '@testing-library/react'
import { MediaImageType } from '@/types/index'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
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

const images = {
  id: mediaImage.id,
  url: mediaImage.url,
  width: mediaImage.width,
  height: mediaImage.height,
  alt: mediaImage.alt,
  title: mediaImage.title,
  imageStyle: mediaImage.imageStyle,
}

const teaserData = {
  title: 'We honor outstanding doctors',
  introText:
    'When a hospital has a host of great doctors, honoring just two every year is challenging.',
  link: '#',
  image: mediaImage,
  id: '12345',
  published: true,
  type: 'node--news_story',
}

describe('<NewsStoryTeaser> with valid data', () => {
  test('renders component', () => {
    const { container } = render(<NewsStoryTeaser {...teaserData} />)
    const imgEl = container.querySelectorAll('img')

    expect(imgEl.length).toBe(0) // fix this
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /When a hospital has a host of great doctors, honoring just two every year is challenging./
      )
    ).toBeInTheDocument()
  })

  test('renders component without image', () => {
    teaserData.image = null
    const { container } = render(<NewsStoryTeaser {...teaserData} />)
    const imgEl = container.querySelectorAll('img')

    expect(imgEl.length).toBe(0)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /When a hospital has a host of great doctors, honoring just two every year is challenging./
      )
    ).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { MediaImageType } from '@/types/index'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
// Language: typescript
// Path: src/components/media/index.test.tsx

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
// const images = {
//   id: image.id,
//   url: image.url,
//   width: image.width,
//   height: image.height,
//   alt: image.alt,
//   title: image.title,
//   imageStyle: image.imageStyle,
// }
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

    expect(imgEl.length).toBe(2)

    screen.debug()
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

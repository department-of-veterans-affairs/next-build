import { render, screen } from '@testing-library/react'
import { NewsStoryTeaser } from '@/components/newsStoryTeaser'
import { mediaImageDataService } from '@/components/media/dataService'
import mediaImage from '@/components/media/mockMedia.json'
// Language: typescript
// Path: src/components/media/index.test.tsx
const image = mediaImageDataService(mediaImage, 'full_content_width')

const images = {
  id: image.id,
  url: image.url,
  width: image.width,
  height: image.height,
  alt: image.alt,
  title: image.title,
  styles: image.styles,
  imageStyle: null,
}
const teaserData = {
  title: 'We honor outstanding doctors',
  introText:
    'When a hospital has a host of great doctors, honoring just two every year is challenging.',
  link: '#',
  image: images,
}

describe('<NewsStoryTeaser> with valid data', () => {
  test('renders component', () => {
    const { container } = render(<NewsStoryTeaser {...teaserData} />)
    const imgEl = container.querySelectorAll('img')

    expect(imgEl.length).toBe(2)
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

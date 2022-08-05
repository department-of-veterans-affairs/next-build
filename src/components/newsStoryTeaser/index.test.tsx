import { render } from '@testing-library/react'
import { NewsStoryTeaser } from '@/components/newsStoryTeaser'

const image = {
  url: 'https://www.example.com/image.jpg',
  alt: 'pension',
  height: 100,
  title: 'title',
  width: 100,
}

const teaserData = {
  title: 'We honor outstanding doctors',
  introText:
    'When a hospital has a host of great doctors, honoring just two every year is challenging.',
  link: '#',
  image: image,
}

test('<NewsStoryTeaser> component renders', () => {
  const { container } = render(<NewsStoryTeaser {...teaserData} />)
})

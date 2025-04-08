import { render, screen } from '@testing-library/react'
import { MediaImage } from '@/types/formatted/media'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
// Language: typescript
// Path: src/components/media/index.test.tsx

const mediaImage: MediaImage = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  links: {
    '2_1_large': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
      meta: {
        linkParams: {
          width: 318,
          height: 159,
        },
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 318,
  height: 159,
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
  lastUpdated: '2021-05-25T14:00:00.000Z',
}

describe('<NewsStoryTeaser> with valid data', () => {
  test('renders component with image when image data is valid', () => {
    const { container } = render(<NewsStoryTeaser {...teaserData} />)
    const imgEl = container.querySelector('img')
    expect(imgEl).toBeTruthy()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /When a hospital has a host of great doctors, honoring just two every year is challenging./
      )
    ).toBeInTheDocument()
  })

  test('renders component without image when image is null', () => {
    const dataWithoutImage = { ...teaserData, image: null }
    const { container } = render(<NewsStoryTeaser {...dataWithoutImage} />)
    const imgEl = container.querySelector('img')
    expect(imgEl).toBeNull()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /When a hospital has a host of great doctors, honoring just two every year is challenging./
      )
    ).toBeInTheDocument()
  })

  test('renders component without image when image links are missing', () => {
    const dataWithInvalidImage = {
      ...teaserData,
      image: { ...mediaImage, links: undefined },
    }
    const { container } = render(<NewsStoryTeaser {...dataWithInvalidImage} />)
    const imgEl = container.querySelector('img')
    expect(imgEl).toBeNull()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
  })

  it('renders correctly with default heading level', () => {
    render(<NewsStoryTeaser {...teaserData} headingLevel={undefined} />)
    expect(document.querySelector('h2')).toBeInTheDocument()
    expect(screen.getByText(teaserData.title)).toBeInTheDocument()
  })

  it('renders correctly with specified heading level', () => {
    render(<NewsStoryTeaser {...teaserData} headingLevel="h3" />)
    expect(document.querySelector('h3')).toBeInTheDocument()
    expect(screen.getByText(teaserData.title)).toBeInTheDocument()
  })
})

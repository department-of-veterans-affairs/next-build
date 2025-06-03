import { render, screen } from '@testing-library/react'
import { MediaImage } from '@/types/formatted/media'
import { StoryTeaser } from './StoryTeaser'

const mockMediaImage: MediaImage = {
  id: '3d6716b3-fb66-4e63-9b21-bb9c024129d3',
  links: {
    '3_2_medium_thumbnail': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/3_2_medium_thumbnail/public/2019-05/doctor-year2019-decker-480_0.jpg',
      meta: {
        linkParams: {
          width: 480,
          height: 320,
        },
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: 'Test Image Title',
  width: 480,
  height: 320,
}

const mockStoryTeaserData = {
  id: '12345',
  type: 'node--news_story' as const,
  published: true,
  title: 'We honor outstanding doctors',
  introText:
    "When a hospital has a host of great doctors, honoring just two every year is challenging. That's what makes this story even more remarkable.",
  link: '/health-care/news/outstanding-doctors',
  image: mockMediaImage,
  lastUpdated: '2021-05-25T14:00:00.000Z',
}

describe('StoryTeaser Component', () => {
  test('renders component with all required elements', () => {
    const { container } = render(<StoryTeaser {...mockStoryTeaserData} />)

    // Check for title heading
    const titleHeading = screen.getByRole('heading', { level: 3 })
    expect(titleHeading).toBeInTheDocument()
    expect(titleHeading).toHaveClass(
      'vads-u-font-size--md',
      'medium-screen:vads-u-font-size--lg'
    )

    // Check for va-link element
    const link = container.querySelector('va-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', mockStoryTeaserData.link)
    expect(link).toHaveAttribute('text', mockStoryTeaserData.title)

    // Check for intro text paragraph
    expect(
      screen.getByText(/When a hospital has a host of great doctors/)
    ).toBeInTheDocument()

    // Check for image
    const image = container.querySelector('img')
    expect(image).toBeInTheDocument()
  })

  test('has proper heading structure', () => {
    render(<StoryTeaser {...mockStoryTeaserData} />)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toBeInTheDocument()

    // The heading contains a va-link element, not direct text
    const link = heading.querySelector('va-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('text', mockStoryTeaserData.title)
  })

  test('truncates long intro text correctly', () => {
    const longIntroText =
      'This is a very long introduction text that should be truncated when it exceeds the specified word limit of sixty words. This text is intentionally made longer to test the truncation functionality of the component. We want to ensure that the text is properly cut off and has ellipsis added to indicate that there is more content available if you visit the story page.'

    const dataWithLongText = {
      ...mockStoryTeaserData,
      introText: longIntroText,
    }

    render(<StoryTeaser {...dataWithLongText} />)

    // Check that the text was truncated and contains ellipsis
    const paragraph = screen.getByText(/This is a very long introduction text/)
    expect(paragraph).toBeInTheDocument()
    expect(paragraph.textContent).toContain('...')
  })

  test('does not truncate short intro text', () => {
    const shortIntroText = 'This is short text.'

    const dataWithShortText = {
      ...mockStoryTeaserData,
      introText: shortIntroText,
    }

    render(<StoryTeaser {...dataWithShortText} />)

    expect(screen.getByText(shortIntroText)).toBeInTheDocument()
  })

  test('renders MediaImage component with correct props', () => {
    const { container } = render(<StoryTeaser {...mockStoryTeaserData} />)

    const image = container.querySelector('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', mockMediaImage.alt)
    expect(image).toHaveClass('region-img')
    expect(image.getAttribute('src')).toContain('3_2_medium_thumbnail')
  })
})

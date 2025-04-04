import { render, screen } from '@testing-library/react'
import { MediaImage } from '@/types/formatted/media'
import { NewsStory } from './index'

const mediaImage: MediaImage = {
  id: '3',
  links: {
    '2_1_large': {
      href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
      meta: {
        linkParams: {
          width: 700,
          height: 350,
        },
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 700,
  height: 350,
}

const data = {
  id: 'a1b2c3',
  published: true,
  breadcrumbs: [
    { title: 'Home', uri: '/', options: [] },
    { title: 'News', uri: '/news', options: [] },
  ],
  type: 'node--news_story',
  title: 'We honor outstanding doctors\n',
  entityId: 1234,
  entityPath: 'sample/path/url',
  image: mediaImage,
  caption:
    '"Caring for a single patient and solving that one patient\'s illness is our honor and privilege as health care providers." - Dr. Brooke Decker',
  author: {
    title: 'Keith Gottschalk',
  },
  introText:
    'When a hospital has a host of great doctors, honoring just two every year is challenging.',
  bodyContent:
    "VA Pittsburgh's Outstanding Physicians of the Year for 2019, Drs. Brooke Decker and Aref M. Rahman, stand out for expertly filling critical medical facility roles while fostering a collaborative spirit among staff in caring for Veterans.\n" +
    '\n' +
    "Decker and Rahman were formally recognized as Outstanding Physicians of the Year on April 26 during the medical staff's quarterly meeting at University Drive.",
  date: 'May 14, 2019',
  socialLinks: {
    path: '/foo',
    title: 'We honor outstanding doctors',
  },
  listing: '/pittsburgh-health-care/stories',
  administration: {
    id: 12,
    name: 'VA Pittsburgh health care',
  },
  metatags: [
    {
      attributes: {
        content:
          'It’s never too late to quit smoking and start breathing easier | VA Minneapolis health care | Veterans Affairs',
        name: 'title',
      },
      tag: 'meta',
    },
    {
      attributes: {
        content:
          'When you stop smoking, you feel the benefits almost immediately, no matter how long you’ve smoked.',
        name: 'description',
      },
      tag: 'meta',
    },
  ],
  lastUpdated: '2021-07-01T14:00:00.000Z',
}

describe('<newsStory> with valid data', () => {
  let spy: jest.SpyInstance
  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => null)
  })
  afterEach(() => {
    spy.mockRestore()
  })
  test('renders component', () => {
    const { container } = render(<NewsStory {...data} />)
    const imgEl = container.querySelector('img')
    expect(imgEl).toBeTruthy()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })

  test('renders component without image', () => {
    const dataWithoutImage = { ...data, image: null }
    const { container } = render(<NewsStory {...dataWithoutImage} />)
    const imgEl = container.querySelector('img')
    expect(imgEl).toBeNull()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })

  test('sets correct imageClassName when caption is provided', () => {
    const dataWithCaption = { ...data, caption: 'Sample caption' }
    const { container } = render(<NewsStory {...dataWithCaption} />)
    const imageElement = container.querySelector('img')
    expect(imageElement).toHaveClass('vads-u-margin-bottom--1')
  })

  test('sets correct imageClassName when caption is not provided', () => {
    const dataWithoutCaption = { ...data, caption: null }
    const { container } = render(<NewsStory {...dataWithoutCaption} />)
    const imageElement = container.querySelector('img')
    expect(imageElement).toHaveClass('vads-u-margin-bottom--2p5')
  })

  test('does not render image markup or caption div when image source is invalid', () => {
    const invalidImageData = {
      ...data,
      image: { ...mediaImage, links: { '2_1_large': { href: '' } } },
      caption: 'This caption should not appear',
    }
    const { container } = render(<NewsStory {...invalidImageData} />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.vads-u-font-size--sm')).toBeNull()
    expect(screen.queryByText('This caption should not appear')).toBeNull()
  })
})

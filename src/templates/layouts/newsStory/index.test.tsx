import { render, screen } from '@testing-library/react'
import { MediaImageType } from '@/types/index'
import { NewsStory } from './index'

const mediaImage: MediaImageType = {
  id: '3',
  link: {
    href: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
    meta: {
      linkParams: {
        width: 700,
        height: 350,
      },
    },
  },
  alt: 'Smiling man in glasses.',
  title: '',
  width: 700,
  height: 350,
  url: 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/styles/2_1_large/public/2019-05/doctor-year2019-decker-480_0.jpg',
}

const data = {
  id: 'a1b2c3',
  published: true,
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
    const imgEl = container.querySelectorAll('img')
    expect(imgEl).toBeTruthy()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })

  test('renders component without image', () => {
    data.image = null
    const { container } = render(<NewsStory {...data} />)
    const imgEl = container.querySelectorAll('img')
    expect(imgEl.length).toBe(1)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })
})

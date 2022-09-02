import { render, screen } from '@testing-library/react'
import { MediaImageType } from '@/types/index'
import { NewsStory } from './index'

const mediaImage: MediaImageType = {
  id: '3',
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

const data = {
  id: 'a1b2c3',
  published: true,
  type: 'node--news_story',
  title: 'We honor outstanding doctors\n',
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
}

describe('<newsStory> with valid data', () => {
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

    expect(imgEl.length).toBe(2)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })
})

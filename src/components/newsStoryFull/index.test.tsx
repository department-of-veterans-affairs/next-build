import { render, screen } from '@testing-library/react'
import { NewsStoryFull } from '.'

const image = {
  url: 'https://www.example.com/image.jpg',
  alt: 'pension',
  height: 100,
  title: 'title',
  width: 100,
}

const data = {
  title: 'We honor outstanding doctors\n',
  image: image,
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

describe('<NewsStoryFull> with valid data', () => {
  test('renders component', () => {
    const { container } = render(<NewsStoryFull {...data} />)
    const imgEl = container.querySelectorAll('img')

    expect(imgEl).toBeTruthy()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })

  test('renders component without image', () => {
    data.image = null
    const { container } = render(<NewsStoryFull {...data} />)
    const imgEl = container.querySelectorAll('img')

    expect(imgEl.length).toBe(0)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Keith Gottschalk/)).toBeInTheDocument()
  })
})

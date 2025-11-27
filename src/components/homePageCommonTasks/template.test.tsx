import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { HomePageCommonTasks } from './template'
import { CommonTasksData } from './formatted-type'

const mockSearchLinks = [
  { url: '/find-locations', title: 'Find Locations' },
  { url: '/contact-us', title: 'Contact Us' },
  { url: '/find-forms', title: 'Find Forms' },
]

const mockPopularLinks = [
  { url: '/health-care', title: 'Health Care' },
  { url: '/benefits', title: 'Benefits' },
  { url: '/disability', title: 'Disability' },
]

const mockData: CommonTasksData = {
  searchLinks: mockSearchLinks,
  popularLinks: mockPopularLinks,
}

describe('HomePageCommonTasks Component', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<HomePageCommonTasks {...mockData} />)

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders Search section header', () => {
    render(<HomePageCommonTasks {...mockData} />)

    const searchHeader = screen.getByText('Search')
    expect(searchHeader).toBeInTheDocument()
    expect(searchHeader).toHaveAttribute('id', 'search-tools-header')
    expect(searchHeader.tagName).toBe('H2')
  })

  test('renders Other search tools section header', () => {
    render(<HomePageCommonTasks {...mockData} />)

    const otherSearchHeader = screen.getByText('Other search tools')
    expect(otherSearchHeader).toBeInTheDocument()
    expect(otherSearchHeader.tagName).toBe('H3')
  })

  test('renders Top pages section header', () => {
    render(<HomePageCommonTasks {...mockData} />)

    const topPagesHeader = screen.getByText('Top pages')
    expect(topPagesHeader).toBeInTheDocument()
    expect(topPagesHeader.tagName).toBe('H2')
  })

  test('renders homepage search widget', () => {
    const { container } = render(<HomePageCommonTasks {...mockData} />)

    const searchWidget = container.querySelector(
      '[data-widget-type="homepage-search"]'
    )
    expect(searchWidget).toBeInTheDocument()
  })

  test('renders all search links correctly', () => {
    const { container } = render(<HomePageCommonTasks {...mockData} />)

    const searchLinks = container.querySelectorAll(
      '.homepage-common-tasks__search-tools va-link'
    )
    expect(searchLinks).toHaveLength(mockSearchLinks.length)

    mockSearchLinks.forEach((link, index) => {
      const vaLink = searchLinks[index]
      expect(vaLink).toHaveAttribute('href', link.url)
      expect(vaLink).toHaveAttribute('text', link.title)
    })
  })

  test('handles empty search links array', () => {
    const { container } = render(
      <HomePageCommonTasks searchLinks={[]} popularLinks={mockPopularLinks} />
    )

    const searchLinks = container.querySelectorAll(
      '.homepage-common-tasks__search-tools va-link'
    )
    expect(searchLinks).toHaveLength(0)
  })

  test('renders all popular links correctly', () => {
    const { container } = render(<HomePageCommonTasks {...mockData} />)

    const popularLinks = container.querySelectorAll(
      '.homepage-common-tasks__list va-link'
    )
    expect(popularLinks).toHaveLength(mockPopularLinks.length)

    mockPopularLinks.forEach((link, index) => {
      const vaLink = popularLinks[index]
      expect(vaLink).toHaveAttribute('href', link.url)
      expect(vaLink).toHaveAttribute('text', link.title)
    })
  })

  test('handles empty popular links array', () => {
    const { container } = render(
      <HomePageCommonTasks searchLinks={mockSearchLinks} popularLinks={[]} />
    )

    const popularLinks = container.querySelectorAll(
      '.homepage-common-tasks__list va-link'
    )
    expect(popularLinks).toHaveLength(0)
  })

  test('lists have proper role attributes', () => {
    const { container } = render(<HomePageCommonTasks {...mockData} />)

    const lists = container.querySelectorAll('ul[role="list"]')
    expect(lists.length).toBe(2)
  })
})

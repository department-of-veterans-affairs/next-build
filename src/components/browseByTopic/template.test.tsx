import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { axe } from '@/test-utils'
import { BrowseByTopic } from './template'

jest.mock('@/lib/analytics/recordEvent')
import { recordEvent } from '@/lib/analytics/recordEvent'

const props = {
  tags: [
    {
      id: 'tag-1',
      href: '/resources/tag/all-veterans',
      name: 'All Veterans',
      categoryLabel: 'Audience',
    },
    {
      id: 'tag-2',
      href: '/resources/tag/payments',
      name: 'Payments and debt',
      categoryLabel: 'Topics',
    },
  ],
  categories: [
    {
      id: 'cat-1',
      href: '/resources/disability',
      name: 'Disability',
      categoryLabel: 'Resources and Support',
    },
  ],
}

describe('BrowseByTopic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders nothing when both tags and categories are empty', () => {
    const { container } = render(<BrowseByTopic tags={[]} categories={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders "Browse by topic" heading', () => {
    render(<BrowseByTopic {...props} />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Browse by topic'
    )
  })

  test('renders tags and categories in order (tags first, then categories)', () => {
    const { container } = render(<BrowseByTopic {...props} />)

    const vaLinks = container.querySelectorAll('va-link')
    expect(vaLinks.length).toBe(3)
    expect(vaLinks[0].getAttribute('text')).toBe('All Veterans')
    expect(vaLinks[1].getAttribute('text')).toBe('Payments and debt')
    expect(vaLinks[2].getAttribute('text')).toBe('Disability')
  })

  test('renders only categories when tags are empty', () => {
    const { container } = render(
      <BrowseByTopic tags={[]} categories={props.categories} />
    )

    const vaLinks = container.querySelectorAll('va-link')
    expect(vaLinks.length).toBe(1)
    expect(vaLinks[0].getAttribute('text')).toBe('Disability')
  })

  test('renders va-link elements with correct href and text', () => {
    const { container } = render(<BrowseByTopic {...props} />)

    const allVeteransLink = container.querySelector(
      'va-link[text="All Veterans"]'
    )
    expect(allVeteransLink).toHaveAttribute(
      'href',
      '/resources/tag/all-veterans'
    )
  })

  test('renders unstyled list with correct structure', () => {
    const { container } = render(<BrowseByTopic {...props} />)

    const list = container.querySelector('ul.usa-unstyled-list')
    expect(list).toBeInTheDocument()
    expect(list).toHaveAttribute('role', 'list')
  })

  test('renders wrapper with data-template attribute', () => {
    const { container } = render(<BrowseByTopic {...props} />)

    const wrapper = container.querySelector('[data-template="includes/tags"]')
    expect(wrapper).toBeInTheDocument()
  })

  test('calls recordEvent with correct parameters when link is clicked', () => {
    const { container } = render(<BrowseByTopic {...props} />)

    const vaLink = container.querySelector(
      'va-link[text="All Veterans"]'
    ) as HTMLElement
    fireEvent.click(vaLink)

    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-page-tag-click',
      'page-tag-click-label': 'All Veterans',
      'page-tag-category-label': 'Audience',
    })
  })

  test('gives no axe violations', async () => {
    const { container } = render(<BrowseByTopic {...props} />)
    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

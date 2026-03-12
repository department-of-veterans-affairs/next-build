import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { axe } from '@/test-utils'
import { BrowseByTopic } from './BrowseByTopic'
import { formatter } from './query'
import mockData from './mock.json'
import { ParagraphAudienceTopics } from '@/types/drupal/paragraph'
import { AudienceTopics as FormattedAudienceTopics } from './formatted-type'

jest.mock('@/lib/analytics/recordEvent')
import { recordEvent } from '@/lib/analytics/recordEvent'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
const audienceTopicsMocks: ParagraphAudienceTopics[] = mockData

const getFormattedMockWithTags = (): FormattedAudienceTopics => {
  const mockWithTags = audienceTopicsMocks.find(
    (m) =>
      (m.field_audience_beneficiares?.length ?? 0) > 0 ||
      (m.field_topics?.length ?? 0) > 0
  )
  return formatter(mockWithTags) as FormattedAudienceTopics
}

describe('BrowseByTopic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders "Browse by topic" heading', () => {
    const props = getFormattedMockWithTags()
    render(<BrowseByTopic {...props} />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Browse by topic'
    )
  })

  test('renders topic links from mock data', () => {
    const props = getFormattedMockWithTags()
    const { container } = render(<BrowseByTopic {...props} />)

    const allVeteransLink = container.querySelector(
      'va-link[text="All Veterans"]'
    )
    const paymentsLink = container.querySelector(
      'va-link[text="Payments and debt"]'
    )
    expect(allVeteransLink).toBeInTheDocument()
    expect(paymentsLink).toBeInTheDocument()
  })

  test('renders va-link elements with correct href and text', () => {
    const props = getFormattedMockWithTags()
    const { container } = render(<BrowseByTopic {...props} />)

    const vaLinks = container.querySelectorAll('va-link')
    expect(vaLinks.length).toBeGreaterThanOrEqual(2)

    const allVeteransLink = Array.from(vaLinks).find(
      (el: Element) => el.getAttribute('text') === 'All Veterans'
    )
    expect(allVeteransLink).toHaveAttribute(
      'href',
      '/resources/tag/all-veterans'
    )
  })

  test('renders unstyled list with correct structure', () => {
    const props = getFormattedMockWithTags()
    const { container } = render(<BrowseByTopic {...props} />)

    const list = container.querySelector('ul.usa-unstyled-list')
    expect(list).toBeInTheDocument()
    expect(list).toHaveAttribute('role', 'list')
  })

  test('renders wrapper with data-template attribute', () => {
    const props = getFormattedMockWithTags()
    const { container } = render(<BrowseByTopic {...props} />)

    const wrapper = container.querySelector('[data-template="includes/tags"]')
    expect(wrapper).toBeInTheDocument()
  })

  // When tags are empty, the formatter returns null and the caller does not render.
  // BrowseByTopic is only rendered with non-empty tags.

  test('calls recordEvent with correct parameters when link is clicked', () => {
    const props = getFormattedMockWithTags()
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
    const props = getFormattedMockWithTags()
    const { container } = render(<BrowseByTopic {...props} />)
    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

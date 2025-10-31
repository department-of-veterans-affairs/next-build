import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { RelatedLinks } from './template'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { LinkTeaser } from '../linkTeaser/formatted-type'

// Mock recordEvent
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

let idCounter = 0
const createMockLinkTeaser = (data: Partial<LinkTeaser>) =>
  ({
    id: `${idCounter++}`,
    type: 'paragraph--link_teaser' as const,
    options: null,
    parentField: null,
    summary: null,
    ...data,
  }) as LinkTeaser

const mockRelatedLinks: ListOfLinkTeasers = {
  type: 'paragraph--list_of_link_teasers',
  id: '1',
  title: 'Related information',
  linkTeasers: [
    createMockLinkTeaser({
      uri: 'https://va.gov/burials-memorials/eligibility',
      title: 'Eligibility for burial in a VA national cemetery',
    }),
    createMockLinkTeaser({
      uri: 'https://va.gov/burials-memorials/schedule-a-burial',
      title: 'Schedule a burial for a Veteran or family member',
    }),
  ],
}

describe('RelatedLinks Component', () => {
  test('renders the correct number of links when there are multiple', () => {
    const { container } = render(<RelatedLinks {...mockRelatedLinks} />)

    expect(container.innerHTML).toContain(
      'Eligibility for burial in a VA national cemetery'
    )
    expect(container.innerHTML).toContain(
      'href="https://va.gov/burials-memorials/eligibility"'
    )
    expect(container.innerHTML).toContain(
      'Schedule a burial for a Veteran or family member'
    )
    expect(container.innerHTML).toContain(
      'href="https://va.gov/burials-memorials/schedule-a-burial"'
    )
  })

  test('renders link correctly when there is only one', () => {
    const oneLink: ListOfLinkTeasers = {
      ...mockRelatedLinks,
      linkTeasers: [
        createMockLinkTeaser({
          uri: 'https://va.gov/burials-memorials/schedule-a-burial',
          title: 'Schedule a burial for a Veteran or family member',
          summary: null,
        }),
      ],
    }

    const { container } = render(<RelatedLinks {...oneLink} />)

    expect(container.innerHTML).toContain(
      'Schedule a burial for a Veteran or family member'
    )
    expect(container.innerHTML).toContain(
      'href="https://va.gov/burials-memorials/schedule-a-burial"'
    )
  })

  test('clicking a link sends correct params to recordEvent', () => {
    const sectionTitle = 'Related information'
    const linkTitle = 'Eligibility for burial in a VA national cemetery'
    const relatedLinks: ListOfLinkTeasers = {
      ...mockRelatedLinks,
      linkTeasers: [
        createMockLinkTeaser({
          uri: 'https://va.gov/burials-memorials/eligibility',
          title: linkTitle,
          summary:
            'Here is a summary for this URL so you can see how it displays underneath.',
        }),
      ],
      title: sectionTitle,
    }
    const { container } = render(<RelatedLinks {...relatedLinks} />)
    const linkEl = container.querySelector('va-link')

    fireEvent.click(linkEl)
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-featured-content-link-click',
      'featured-content-header': sectionTitle,
      'featured-content-click-label': linkTitle,
    })
  })

  test('does not display link summaries even when they exist in the data', () => {
    const summaryText =
      'This summary should not be displayed in the rendered output'
    const relatedLinks: ListOfLinkTeasers = {
      ...mockRelatedLinks,
      linkTeasers: [
        createMockLinkTeaser({
          uri: 'https://va.gov/example',
          title: 'Example Link',
          summary: summaryText,
        }),
      ],
    }

    const { container } = render(<RelatedLinks {...relatedLinks} />)

    expect(container.innerHTML).toContain('Example Link')
    expect(container.innerHTML).not.toContain(summaryText)
  })

  test('limits displayed links to MAX_SHOWN_LINKS (8) when there are more links', () => {
    const manyLinks: ListOfLinkTeasers = {
      ...mockRelatedLinks,
      linkTeasers: Array.from({ length: 10 }, (_, i) =>
        createMockLinkTeaser({
          uri: `https://va.gov/example-${i + 1}`,
          title: `Link ${i + 1}`,
        })
      ),
    }

    const { container } = render(<RelatedLinks {...manyLinks} />)

    // Should render exactly 8 va-link elements
    const links = container.querySelectorAll('va-link')
    expect(links).toHaveLength(8)

    // First 8 links should be present
    expect(container.innerHTML).toContain('Link 1')
    expect(container.innerHTML).toContain('Link 8')

    // 9th and 10th links should not be present
    expect(container.innerHTML).not.toContain('Link 9')
    expect(container.innerHTML).not.toContain('Link 10')
  })
})

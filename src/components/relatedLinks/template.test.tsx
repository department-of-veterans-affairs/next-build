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
      summary:
        'Here is a summary for this URL so you can see how it displays underneath.',
    }),
    createMockLinkTeaser({
      uri: 'https://va.gov/burials-memorials/schedule-a-burial',
      title: 'Schedule a burial for a Veteran or family member',
      summary: null,
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
      'Here is a summary for this URL so you can see how it displays underneath.'
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
})

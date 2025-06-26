import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { RelatedLinks } from '.'
import { FormattedRelatedLinks } from '@/types/formatted/relatedLinks'
import { recordEvent } from '@/lib/analytics/recordEvent'

// Mock recordEvent
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

describe('RelatedLinks Component', () => {
  test('renders the correct number of links when there are multiple', () => {
    const relatedLinks: FormattedRelatedLinks = {
      links: [
        {
          uri: 'https://va.gov/burials-memorials/eligibility',
          title: 'Eligibility for burial in a VA national cemetery',
          summary:
            'Here is a summary for this URL so you can see how it displays underneath.',
        },
        {
          uri: 'https://va.gov/burials-memorials/schedule-a-burial',
          title: 'Schedule a burial for a Veteran or family member',
          summary: null,
        },
      ],
      sectionTitle: 'Related information',
    }

    const { container } = render(<RelatedLinks {...relatedLinks} />)

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
    const oneLink: FormattedRelatedLinks = {
      links: [
        {
          uri: 'https://va.gov/burials-memorials/schedule-a-burial',
          title: 'Schedule a burial for a Veteran or family member',
          summary: null,
        },
      ],
      sectionTitle: 'VA benefits',
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
    const title = 'Eligibility for burial in a VA national cemetery'
    const relatedLinks: FormattedRelatedLinks = {
      links: [
        {
          uri: 'https://va.gov/burials-memorials/eligibility',
          title,
          summary:
            'Here is a summary for this URL so you can see how it displays underneath.',
        },
      ],
      sectionTitle,
    }
    const { container } = render(<RelatedLinks {...relatedLinks} />)
    const linkEl = container.querySelector('va-link')

    fireEvent.click(linkEl)
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-featured-content-link-click',
      'featured-content-header': sectionTitle,
      'featured-content-click-label': title,
    })
  })
})

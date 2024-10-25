import { render } from '@testing-library/react'
import { RelatedLinks } from '.'
import { FormattedRelatedLinks } from '@/types/formatted/relatedLinks'

describe('RelatedLinks Component', () => {
  test('renders the correct number of links when there are multiple', () => {
    const relatedLinks: FormattedRelatedLinks = {
      links: [
        {
          url: 'https://va.gov/burials-memorials/eligibility',
          title: 'Eligibility for burial in a VA national cemetery',
          summary: null,
        },
        {
          url: 'https://va.gov/burials-memorials/schedule-a-burial',
          title: 'Schedule a burial for a Veteran or family member',
          summary: null,
        }
      ],
      sectionTitle: 'Related information'
    }

    const { container } = render(<RelatedLinks {...relatedLinks} />)

    expect(container.innerHTML).toContain('Eligibility for burial in a VA national cemetery')
    expect(container.innerHTML).toContain('href="https://va.gov/burials-memorials/eligibility"')
    expect(container.innerHTML).toContain('Schedule a burial for a Veteran or family member')
    expect(container.innerHTML).toContain('href="https://va.gov/burials-memorials/schedule-a-burial"')
  })

  test('renders link correctly when there is only one', () => {
    const oneLink: FormattedRelatedLinks = {
      links: [
        {
          url: 'https://va.gov/burials-memorials/schedule-a-burial',
          title: 'Schedule a burial for a Veteran or family member',
          summary: null,
        }
      ],
      sectionTitle: 'VA benefits'
    }

    const { container } = render(<RelatedLinks {...oneLink} />)

    expect(container.innerHTML).toContain('Schedule a burial for a Veteran or family member')
    expect(container.innerHTML).toContain('href="https://va.gov/burials-memorials/schedule-a-burial"')
  })
})

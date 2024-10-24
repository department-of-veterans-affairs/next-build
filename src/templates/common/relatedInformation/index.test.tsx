import { render } from '@testing-library/react'
import { RelatedInformation } from './'
import { LinkTeaser } from '@/types/formatted/linkTeaser'
import { ParagraphComponent } from '@/types/formatted/paragraph'

describe('RelatedInformation Component', () => {
  test('renders the correct number of links when there are multiple', () => {
    const relatedInformation: ParagraphComponent<LinkTeaser>[] = [
      {
        id: '1',
        uri: 'https://va.gov/burials-memorials/eligibility',
        title: 'Eligibility for burial in a VA national cemetery',
        summary: null,
        parentField: null,
        options: [],
        componentParams: null
      },
      {
        id: '2',
        uri: 'https://va.gov/burials-memorials/schedule-a-burial',
        title: 'Schedule a burial for a Veteran or family member',
        summary: null,
        parentField: null,
        options: [],
        componentParams: null
      }
    ]

    const { container } = render(<RelatedInformation relatedInformation={relatedInformation} />)

    expect(container.innerHTML).toContain('Eligibility for burial in a VA national cemetery')
    expect(container.innerHTML).toContain('href="https://va.gov/burials-memorials/eligibility"')
    expect(container.innerHTML).toContain('Schedule a burial for a Veteran or family member')
    expect(container.innerHTML).toContain('href="https://va.gov/burials-memorials/schedule-a-burial"')
  })

  test('renders link correctly when there is only one', () => {
    const oneLink: ParagraphComponent<LinkTeaser>[] = [
      {
        id: '3',
        uri: 'https://va.gov/burials-memorials/schedule-a-burial',
        title: 'Schedule a burial for a Veteran or family member',
        summary: null,
        parentField: null,
        options: [],
        componentParams: null
      }
    ]

    const { container } = render(<RelatedInformation relatedInformation={oneLink} />)

    expect(container.innerHTML).toContain('Schedule a burial for a Veteran or family member')
    expect(container.innerHTML).toContain('href="https://va.gov/burials-memorials/schedule-a-burial"')
  })
})

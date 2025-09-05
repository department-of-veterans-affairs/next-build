import { render, screen } from '@testing-library/react'
import { ListOfLinkTeasers } from './template'
import mockData from './mock.formatted'

describe('ListOfLinkTeasers', () => {
  it('renders the component with title and link teasers', () => {
    const { container } = render(<ListOfLinkTeasers {...mockData} />)

    const heading = screen.getByText('More information')
    expect(heading).toHaveAttribute('id', 'more-information')

    const getLink = (text: string) =>
      container.querySelector(`va-link[text="${text}"]`)

    expect(getLink('VA health care copay rates')).toBeInTheDocument()
    expect(getLink('Financial hardship assistance')).toBeInTheDocument()
    expect(getLink('Dispute your VA copay charges')).toBeInTheDocument()
    expect(getLink('Change your address on file with VA')).toBeInTheDocument()

    expect(
      screen.getByText(
        'Review copay rates for outpatient care, hospital stays, medications, and other health services.'
      )
    ).toBeInTheDocument()
  })

  it('renders without title when title is empty', () => {
    const componentWithoutTitle = {
      ...mockData,
      title: '',
    }

    render(<ListOfLinkTeasers {...componentWithoutTitle} />)

    expect(screen.queryByText('More information')).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Review copay rates for outpatient care, hospital stays, medications, and other health services.'
      )
    ).toBeInTheDocument()
  })
})

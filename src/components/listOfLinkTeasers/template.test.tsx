import { render, screen } from '@testing-library/react'
import { ListOfLinkTeasers } from './template'
import mockData from './mock.formatted'

describe('ListOfLinkTeasers', () => {
  it('renders the component with title and link teasers', () => {
    render(<ListOfLinkTeasers {...mockData} />)

    const heading = screen.getByText('More information')
    expect(heading).toHaveAttribute('id', 'more-information')

    expect(screen.getByText('VA health care copay rates')).toBeInTheDocument()
    expect(
      screen.getByText('Financial hardship assistance')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Dispute your VA copay charges')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Change your address on file with VA')
    ).toBeInTheDocument()

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
    expect(screen.getByText('VA health care copay rates')).toBeInTheDocument()
  })
})

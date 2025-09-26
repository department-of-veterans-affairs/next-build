import { render, screen } from '@testing-library/react'
import { ListOfLinkTeasers } from './template'
import mockData from './mock.formatted'

describe('ListOfLinkTeasers', () => {
  it('renders the component with title and link teasers', () => {
    const { container } = render(<ListOfLinkTeasers {...mockData} />)

    const heading = screen.getByText('Other VA Benefits and Services')
    expect(heading).toHaveAttribute('id', 'other-va-benefits-and-services')

    const getLink = (text: string) =>
      container.querySelector(`va-link[text="${text}"]`)

    expect(getLink('GI Bill Benefits')).toBeInTheDocument()
    expect(getLink('Other Educational Assistance Programs')).toBeInTheDocument()
    expect(getLink('Home Loans')).toBeInTheDocument()
    expect(getLink('Life Insurance')).toBeInTheDocument()

    expect(
      screen.getByText(/Explore options for using GI Bill benefits/)
    ).toBeInTheDocument()
  })

  it('renders without title when title is empty', () => {
    const componentWithoutTitle = {
      ...mockData,
      title: '',
    }

    render(<ListOfLinkTeasers {...componentWithoutTitle} />)

    expect(
      screen.queryByText('Other VA Benefits and Services')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(/Explore options for using GI Bill benefits/)
    ).toBeInTheDocument()
  })
})

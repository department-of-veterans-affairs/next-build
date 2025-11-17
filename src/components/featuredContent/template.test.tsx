import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { FeaturedContent } from './template'

const data = {
  id: '1',
  title: 'Hello world',
}

describe('FeaturedContent with valid data', () => {
  test('renders FeaturedContent component', async () => {
    const { container } = render(<FeaturedContent {...data} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders FeaturedContent optional elements', () => {
    const dataWithOptional = {
      ...data,
      description: 'foo bar',
      link: {
        id: '1',
        url: '#',
        label: 'a link',
      },
    }

    render(<FeaturedContent {...dataWithOptional} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
    expect(screen.queryByText(/foo bar/)).toBeInTheDocument()
    // Check for link inside va-link
    const vaLinkElement = screen.getByTestId('featured-content-link')
    expect(vaLinkElement).toBeInTheDocument()
    expect(vaLinkElement).toHaveAttribute('href', '#')
    expect(vaLinkElement).toHaveAttribute('text', 'a link')
  })
})

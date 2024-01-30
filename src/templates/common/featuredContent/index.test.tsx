import { render, screen } from '@testing-library/react'
import { FeaturedContent } from './index'

describe('FeaturedContent with valid data', () => {
  test('renders FeaturedContent component', () => {
    render(<FeaturedContent title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })

  test('renders FeaturedContent optional elements', () => {
    const data = {
      title: 'Hello world',
      description: 'foo bar',
      link: {
        id: '1',
        url: '#',
        label: 'a link',
      },
    }

    render(<FeaturedContent {...data} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
    expect(screen.queryByText(/foo bar/)).toBeInTheDocument()
    expect(screen.queryByText(/a link/)).toBeInTheDocument()
  })
})

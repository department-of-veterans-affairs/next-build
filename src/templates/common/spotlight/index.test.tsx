import { render, screen } from '@testing-library/react'
import { Spotlight } from './index'

describe('Spotlight with valid data', () => {
  test('renders Spotlight component', () => {
    render(<Spotlight title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })

  test('renders Spotlight optional elements', () => {
    const data = {
      title: 'Hello world',
      description: 'foo bar',
      link: {
        href: '#',
        label: 'a link',
      },
    }

    render(<Spotlight {...data} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
    expect(screen.queryByText(/foo bar/)).toBeInTheDocument()
    expect(screen.queryByText(/a link/)).toBeInTheDocument()
  })
})

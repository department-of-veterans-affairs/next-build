import { render, screen } from '@testing-library/react'
import { Footer } from './template'

describe('Footer Component', () => {
  test('renders without errors', () => {
    render(<Footer />)
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})

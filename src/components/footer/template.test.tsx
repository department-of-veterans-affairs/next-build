import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { Footer } from './template'

describe('Footer Component', () => {
  test('renders without errors', async () => {
    const { container } = render(<Footer />)
    expect(screen.getByTestId('footer')).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

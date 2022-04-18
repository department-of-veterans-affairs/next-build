import { render, screen } from '@testing-library/react'
import HomePage from '../pages/index'
import '@testing-library/jest-dom'


describe('HomePage', () => {
  it('renders a heading', () => {
    const nodes = [{ title: 'Home' }]
    render(<HomePage nodes={nodes} />)
    const heading = screen.getByRole('header')
    expect(heading).toBeInTheDocument()
  })
})

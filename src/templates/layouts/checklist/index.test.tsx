import { render, screen } from '@testing-library/react'
import { Checklist } from './index'


describe('Checklist with valid data', () => {
  test('renders Checklist component', () => {
    render(<Checklist title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

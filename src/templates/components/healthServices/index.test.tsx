import { render, screen } from '@testing-library/react'
import { HealthServices } from './index'


describe('HealthServices with valid data', () => {
  test('renders HealthServices component', () => {
    render(<HealthServices title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

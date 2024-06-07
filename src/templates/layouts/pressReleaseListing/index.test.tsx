import { render, screen } from '@testing-library/react'
import { PressReleaseListing } from './index'


describe('PressReleaseListing with valid data', () => {
  test('renders PressReleaseListing component', () => {
    render(<PressReleaseListing title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})

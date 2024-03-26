import { render } from '@testing-library/react'
import { Header } from './'

describe('Header Component', () => {
  test('renders TopNav component within the Header', () => {
    render(<Header />)
    const headerComponent = document.querySelector('#header-v2')
    const topnavComponent = document.querySelector('#legacy-header')
    expect(headerComponent).toBeInTheDocument()
    expect(topnavComponent).toBeInTheDocument()
  })
})

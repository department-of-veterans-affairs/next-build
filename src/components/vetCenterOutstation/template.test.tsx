import { render, screen } from '@testing-library/react'
import { VetCenterOutstation } from './template'
import { mockResponse } from './mock'

describe('VetCenterOutstation with valid data', () => {
  test('renders VetCenterOutstation component', () => {
    const { container } = render(<VetCenterOutstation {...mockResponse} />)
    const imgEl = container.querySelectorAll('img')
    expect(imgEl).toBeTruthy()
    expect(screen.queryByText(/Test introText/)).toBeInTheDocument()
    expect(screen.queryByText(/1010 Delafield Road/)).toBeInTheDocument()
    expect(screen.queryByText(/In the spotlight/)).toBeInTheDocument()
  })
})

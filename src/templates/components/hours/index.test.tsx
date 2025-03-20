import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Hours } from './'

describe('Hours Component', () => {
  it('renders null when allHours is empty', () => {
    const { container } = render(<Hours allHours={[]} headerType="standard" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the correct header for "standard" header type', () => {
    render(
      <Hours
        allHours={[{ day: 1, starthours: 800, endhours: 1700, comment: '' }]}
        headerType="standard"
      />
    )
    expect(screen.getByText('Hours')).toBeInTheDocument()
  })

  it('formats and displays office hours correctly', () => {
    const allHours = [{ day: 1, starthours: 800, endhours: 1700, comment: '' }]
    render(<Hours allHours={allHours} headerType="standard" />)
    expect(screen.getByText('8:00 a.m. to 5:00 p.m.')).toBeInTheDocument()
  })

  it('handles "closed" status correctly', () => {
    const allHours = [{ day: 1, starthours: null, endhours: null, comment: '' }]
    render(<Hours allHours={allHours} headerType="standard" />)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('renders "Clinical hours" for clinical header type', () => {
    render(
      <Hours
        allHours={[{ day: 2, starthours: 900, endhours: 1500, comment: '' }]}
        headerType="clinical"
      />
    )
    expect(screen.getByText('Clinical hours')).toBeInTheDocument()
  })

  it('renders "nonTraditionalHours" status correctly', () => {
    render(
      <Hours
        allHours={[{ day: 2, starthours: 900, endhours: 1500, comment: '' }]}
        headerType="nonTraditionalHours"
      />
    )
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(
      screen.getByText(
        'We also have non-traditional hours that change periodically given our community’s needs. Please call us to find out more.'
      )
    ).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Hours } from './template'

describe('Hours Component', () => {
  const nonTraditionalWarning =
    'We also have non-traditional hours that change periodically given our community’s needs. Please call us to find out more.'

  it('renders all closed when allHours is empty', () => {
    render(<Hours allHours={[]} headerType="standard" />)
    expect(screen.getAllByText('Closed')).toHaveLength(7)
  })

  it('renders the correct header for "standard" header type', () => {
    render(
      <Hours
        allHours={[{ day: 1, starthours: 800, endhours: 1700, comment: '' }]}
        headerType="standard"
      />
    )
    expect(screen.getByRole('heading', { label: 'Hours' })).toBeInTheDocument()
    expect(screen.queryByText(nonTraditionalWarning)).not.toBeInTheDocument()
  })

  it('formats and displays office hours correctly', () => {
    const allHours = [{ day: 1, starthours: 800, endhours: 1700, comment: '' }]
    render(<Hours allHours={allHours} headerType="standard" />)
    expect(screen.getByText('8:00 a.m. to 5:00 p.m.')).toBeInTheDocument()
  })

  it('handles "closed" status correctly', () => {
    const allHours = [{ day: 1, starthours: null, endhours: null, comment: '' }]
    render(<Hours allHours={allHours} headerType="standard" />)
    // Also fills in the blanks with "Closed"
    expect(screen.getAllByText('Closed')).toHaveLength(7)
  })

  it('renders "Clinical hours" for clinical header type', () => {
    render(
      <Hours
        allHours={[{ day: 2, starthours: 900, endhours: 1500, comment: '' }]}
        headerType="clinical"
      />
    )
    expect(
      screen.getByRole('heading', { label: 'Facility hours' })
    ).toBeInTheDocument()
  })

  it('renders "nonTraditionalMessage" correctly', () => {
    render(
      <Hours
        allHours={[{ day: 2, starthours: 900, endhours: 1500, comment: '' }]}
        headerType="standard"
        nonTraditionalMessage={{
          id: '1',
          type: 'paragraph--wysiwyg',
          html: '<p>nonTraditionalMessage</p>',
        }}
      />
    )
    expect(screen.getByRole('heading', { label: 'Hours' })).toBeInTheDocument()
    expect(screen.getByText('nonTraditionalMessage')).toBeInTheDocument()
  })
})

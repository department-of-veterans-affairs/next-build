import { render, screen } from '@testing-library/react'
import { NeedHelp } from './template'

describe('NeedHelp Component', () => {
  test('renders the need help section', () => {
    const { container } = render(<NeedHelp />)

    const vaNeedHelp = container.querySelector('va-need-help')
    expect(vaNeedHelp).toBeInTheDocument()
  })

  test('renders the help text', () => {
    const { container } = render(<NeedHelp />)

    const paragraph = container.querySelector('p')
    expect(paragraph).toBeInTheDocument()

    const fullText = paragraph?.textContent || ''
    expect(fullText).toContain('Call us at')
    expect(fullText).toContain('Monday through Friday')
    expect(fullText).toContain('8:00 a.m to 9:00 p.m ET')
    expect(fullText).toContain('If you have hearing loss')
  })

  test('renders the main phone number', () => {
    const { container } = render(<NeedHelp />)

    const vaTelephones = container.querySelectorAll('va-telephone')
    expect(vaTelephones.length).toBe(2)

    expect(vaTelephones[0]).toHaveAttribute('contact', '8008271000')
    expect(vaTelephones[0]).not.toHaveAttribute('tty')
  })

  test('renders the TTY number', () => {
    const { container } = render(<NeedHelp />)

    const vaTelephones = container.querySelectorAll('va-telephone')

    expect(vaTelephones[1]).toHaveAttribute('contact', '711')
    expect(vaTelephones[1]).toHaveAttribute('tty', 'true')
  })
})

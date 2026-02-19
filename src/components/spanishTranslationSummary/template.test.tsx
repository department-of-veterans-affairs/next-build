import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { SpanishTranslationSummary } from './template'
import { SpanishTranslationSummary as FormattedSpanishTranslationSummary } from './formatted-type'

const data: FormattedSpanishTranslationSummary = {
  type: 'paragraph--spanish_translation_summary',
  id: '3b5269de-386a-4903-aa33-34f702ae2d90',
  entityId: 183011,
  html: '<p>Some hidden text that will be revealed when the user clicks the expander button.</p>',
  textExpander: 'Additional information',
}

describe('<SpanishTranslationSummary>', () => {
  test('renders with correct structure and classes', async () => {
    const { container } = render(<SpanishTranslationSummary {...data} />)

    const mainDiv = container.querySelector(
      '.form-expanding-group.additional-info-container'
    )
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveAttribute(
      'data-template',
      'paragraphs/spanish_translation'
    )
    expect(mainDiv).toHaveAttribute('data-entity-id', '183011')

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders the text expander', () => {
    render(<SpanishTranslationSummary {...data} />)

    const textExpander = screen.getByText('Additional information')
    expect(textExpander).toBeInTheDocument()
    expect(textExpander).toHaveClass('additional-info-title')
    expect(textExpander.tagName).toBe('SPAN')
  })

  test('renders the HTML content within additional-info-content', () => {
    render(<SpanishTranslationSummary {...data} />)

    const content = screen.getByText(
      /Some hidden text that will be revealed when the user clicks the expander button/
    )
    expect(content).toBeInTheDocument()

    const contentDiv = content.closest('.additional-info-content')
    expect(contentDiv).toBeInTheDocument()
  })
})

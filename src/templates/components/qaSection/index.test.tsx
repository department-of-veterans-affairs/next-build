import { render, screen } from '@testing-library/react'
import { QaSection } from './index'
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'

const QaSectionAccordionProps: FormattedQaSection = {
  header: 'Accordion test header',
  intro: 'intro text',
  displayAccordion: true,
  type: 'paragraph--q_a_section',
  id: '1',
  questions: [
    {
      question: 'Question 1',
      answers: [
        {
          id: '1',
          html: '<p>Accordion test string 1</p>',
          type: 'paragraph--wysiwyg',
        },
        {
          id: '2',
          html: '<p>Accordion test string 2</p>',
          type: 'paragraph--wysiwyg',
        },
      ],
      id: '11111-11111-11111',
      type: 'paragraph--q_a',
    },
  ],
}

const QaSectionOtherProps: FormattedQaSection = {
  header: 'Other test header',
  intro: 'intro text',
  displayAccordion: false,
  type: 'paragraph--q_a_section',
  id: '1',
  questions: [
    {
      question: 'Question 1',
      answers: [
        {
          id: '1',
          html: '<p>Other test string 1</p>',
          type: 'paragraph--wysiwyg',
        },
        {
          id: '2',
          html: '<p>Other test string 2</p>',
          type: 'paragraph--wysiwyg',
        },
      ],
      id: '11111-11111-11111',
      type: 'paragraph--q_a',
    },
  ],
}

describe('QaSection with with valid data', () => {
  test('renders QaSection component with accordion', () => {
    render(<QaSection {...QaSectionAccordionProps} />)
    const accordionDiv = document.querySelector(
      'div[data-testid="qa-collapsible-panel"]'
    )
    expect(accordionDiv).toBeInTheDocument()
    expect(screen.queryByText(/Accordion test header/)).toBeInTheDocument()
  })

  test('renders QaSection component without accordion', () => {
    render(<QaSection {...QaSectionOtherProps} />)
    const accordionDiv = document.querySelector(
      'div[data-testid="qa-collapsible-panel"]'
    )
    expect(accordionDiv).not.toBeInTheDocument()
    expect(screen.queryByText(/Other test header/)).toBeInTheDocument()
  })
})

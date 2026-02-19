import { render } from '@testing-library/react'
import { axe } from '@/test-utils'
import { QaCollapsiblePanel } from './QaCollapsiblePanel'
const questionsData = [
  {
    id: '1111-1111-1111',
    question: 'Question 1',
    answers: [
      {
        id: '1',
        html: '<p>test string 1</p>',
        type: 'paragraph--wysiwyg',
      },
      {
        id: '2',
        html: '<p> test string 2</p>',
        type: 'paragraph--wysiwyg',
      },
    ],
    type: 'paragraph--q_a',
  },
  {
    id: '2222-2222-2222',
    question: 'Question 2',
    answers: [
      {
        id: '3',
        html: '<p>test string 3</p>',
        type: 'paragraph--wysiwyg',
      },
      {
        id: '4',
        html: '<p>test string 4</p>',
        type: 'paragraph--wysiwyg',
      },
    ],
    type: 'paragraph--q_a',
  },
]

describe('QaCollapsiblePanel with valid data', () => {
  test('renders QaCollapsiblePanel component', async () => {
    const { container } = render(
      <QaCollapsiblePanel questions={questionsData} />
    )

    const panelDiv = document.querySelector(
      'div[data-template="paragraphs/q_a.collapsible_panel"]'
    )
    expect(panelDiv).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('slugifies the question header', () => {
    const { container } = render(
      <QaCollapsiblePanel questions={questionsData} />
    )

    const questionHeaders = container.querySelectorAll('va-accordion-item')
    expect(questionHeaders[0]).toHaveAttribute('id', 'question-1')
    expect(questionHeaders[1]).toHaveAttribute('id', 'question-2')
  })
})

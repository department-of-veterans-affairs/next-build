import { render, screen } from '@testing-library/react'
import { QaCollapsiblePanel } from './index'
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
]

describe('QaCollapsiblePanel with valid data', () => {
  test('renders QaCollapsiblePanel component', () => {
    render(<QaCollapsiblePanel questions={questionsData} />)

    const panelDiv = document.querySelector(
      'div[data-next-component="templates/components/qaCollapsiblePanel"]'
    )
    expect(panelDiv).toBeInTheDocument()
  })
})

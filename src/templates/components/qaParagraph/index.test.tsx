import { render, screen } from '@testing-library/react'
import { QaParagraph } from '.'
import { QaParagraph as FormattedQaParagraph } from '@/types/formatted/qaParagraph'

const qaParagraphProps: FormattedQaParagraph = {
  question: 'Sample Question',
  id: '1111-1111-1111',
  type: 'paragraph--q_a',
  answers: [
    {
      id: '1',
      html: '<p>test string 1</p>',
      type: 'paragraph--wysiwyg',
    },
    {
      id: '2',
      html: '<p>test string 2</p>',
      type: 'paragraph--wysiwyg',
    },
  ],
}

describe('<QaParagraph> component renders', () => {
  test('with valid data', () => {
    render(<QaParagraph {...qaParagraphProps} />)
    expect(screen.queryByText(/Sample Question/)).toBeInTheDocument()
    expect(screen.queryByText(/test string 1/)).toBeInTheDocument()
    expect(screen.queryByText(/test string 2/)).toBeInTheDocument()
  })

  test('with valid data and setHeader = true', () => {
    const propsWithTrueHeader = { setHeaderh3: true, ...qaParagraphProps }
    render(<QaParagraph {...propsWithTrueHeader} />)
    expect(screen.queryByText(/Sample Question/)).toBeInTheDocument()
    expect(screen.queryByText(/test string 1/)).toBeInTheDocument()
    expect(screen.queryByText(/test string 2/)).toBeInTheDocument()
  })

  test('with valid data and setHeader = false', () => {
    const propsWithFalseHeader = { setHeaderh3: false, ...qaParagraphProps }
    render(<QaParagraph {...propsWithFalseHeader} />)
    expect(screen.queryByText(/Sample Question/)).toBeInTheDocument()
    expect(screen.queryByText(/test string 1/)).toBeInTheDocument()
    expect(screen.queryByText(/test string 2/)).toBeInTheDocument()
  })
})

describe('<QaParagraph> component does not render', () => {
  test('without question and answers data', () => {
    const emptyProps = { ...qaParagraphProps, question: '', answers: [] }
    render(<QaParagraph {...emptyProps} />)
    expect(screen.queryByText(/Sample Question/)).not.toBeInTheDocument()
    expect(screen.queryByText(/test string 1/)).not.toBeInTheDocument()
    expect(screen.queryByText(/test string 2/)).not.toBeInTheDocument()
  })
})

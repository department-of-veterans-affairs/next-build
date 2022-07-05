import { render, screen } from '@testing-library/react'
import { ParagraphWysiwyg } from '@/types/paragraph'
import Wysiwyg from '@/components/paragraph/wysiwyg/index'

const paragraph: ParagraphWysiwyg = {
  type: 'paragraph--wysiwyg',
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'paragraph',
  field_wysiwyg: {
    format: 'rich_text',
    processed: 'If you need support...',
    value: 'If you need support...',
  },
  drupal_internal__id: 123,
  drupal_internal__revision_id: 1,
  langcode: 'en',
  status: true,
}

describe('ParagraphWysiwyg with valid data', () => {
  test('renders ParagraphWysiwyg component', () => {
    render(<Wysiwyg paragraph={paragraph} />)
    expect(screen.queryByText(/If you need support.../)).toBeInTheDocument()
  })
})

describe('ParagraphWysiwyg with invalid data', () => {
  test('does not render ParagraphWysiwyg component when field_wysiwyg is not present', () => {
    paragraph.field_wysiwyg = null
    render(<Wysiwyg paragraph={paragraph} />)
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })

  test('does not render the field_wysiwyg info when field_wysiwyg is not present', () => {
    paragraph.field_wysiwyg = null
    render(<Wysiwyg paragraph={paragraph} />)
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })

  test('does not render the field_wysiwyg info when processed is not present', () => {
    paragraph.field_wysiwyg = {
      format: 'rich_text',
      processed: null,
      value: 'If you need support...',
    }
    render(<Wysiwyg paragraph={paragraph} />)
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })
})

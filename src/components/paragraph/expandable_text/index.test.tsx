import { render, screen } from '@testing-library/react'
import { ParagraphExpandableText } from '@/types/paragraph'
import { ExpandableText } from '@/components/paragraph/expandable_text/index'

const paragraph: ParagraphExpandableText = {
  type: 'paragraph--expandable_text',
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'paragraph',
  field_text_expander: 'Show more',
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

describe('ExpandableText with valid data', () => {
  test('renders ExpandableText component', () => {
    render(<ExpandableText paragraph={paragraph} />)

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toHaveAttribute('header', 'Show more')
    expect(screen.queryByText(/If you need support.../)).toBeInTheDocument()
  })
})

describe('ExpandableText with invalid data', () => {
  test('does not render ExpandableText component when field_text_expander is not present', () => {
    paragraph.field_text_expander = null

    render(<ExpandableText paragraph={paragraph} />)

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toBeFalsy()
  })

  test('does not render the field_wysiwyg info when field_wysiwyg is not present', () => {
    paragraph.field_text_expander = 'Show more'
    paragraph.field_wysiwyg = null
    render(<ExpandableText paragraph={paragraph} />)

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toHaveAttribute('header', 'Show more')
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })

  test('does not render the field_wysiwyg info when processed is not present', () => {
    paragraph.field_text_expander = 'Show more'
    paragraph.field_wysiwyg = {
      format: 'rich_text',
      processed: null,
      value: 'If you need support...',
    }
    render(<ExpandableText paragraph={paragraph} />)

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toHaveAttribute('header', 'Show more')
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })
})

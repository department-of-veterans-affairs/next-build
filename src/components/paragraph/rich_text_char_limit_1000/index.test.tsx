import { render, screen } from '@testing-library/react'
import { ParagraphRichTextCharLimit1000 } from '@/types/paragraph'
import RichTextCharLimit1000 from '@/components/paragraph/rich_text_char_limit_1000/index'

const paragraph: ParagraphRichTextCharLimit1000 = {
  type: 'paragraph--rich_text_char_limit_1000',
  id: 'c4d10aa1-3bb9-4f39-99fd-f110b465603f',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '6887',
  parent_type: 'node',
  field_wysiwyg: {
    format: 'rich_text_limited',
    processed:
      "You'll need to submit:\n\n\nA medical record that shows you have an Agent Orange‒related illness, and\nMilitary records to show how you came into contact with Agent orange during your service\n\n\nIf the illness you’re claiming isn’t a presumptive disease, you’ll also need to: \n\nShow that the problem started during—or got worse because of—your military service, or\nProvide scientific and medical evidence that the illness is related to contact with Agent Orange. Scientific proof may include an article from a medical journal or a published research study. \n\nGet your VA medical records online\nRequest your military service records\n",
    value: 'null',
  },
  drupal_internal__id: 123,
  drupal_internal__revision_id: 1,
  langcode: 'en',
  status: true,
}

describe('ParagraphWysiwyg with valid data', () => {
  test('correctly renders ParagraphWysiwyg component', () => {
    render(<RichTextCharLimit1000 paragraph={paragraph} />)
    expect(
      screen.queryByText(
        /A medical record that shows you have an Agent Orange‒related/
      )
    ).toBeInTheDocument()
  })
})

describe('ParagraphWysiwyg with invalid data', () => {
  test('does not render ParagraphWysiwyg when data is null', () => {
    paragraph.field_wysiwyg = null
    render(<RichTextCharLimit1000 paragraph={paragraph} />)
    expect(
      screen.queryByText(
        /A medical record that shows you have an Agent Orange‒related/
      )
    ).not.toBeInTheDocument()
  })
})

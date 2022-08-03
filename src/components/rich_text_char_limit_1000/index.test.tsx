import { render, screen } from '@testing-library/react'
import { ParagraphWysiwyg } from '@/types/paragraph'
import {
  RichTextCharLimit1000,
  WysiwygProps,
} from '@/components/rich_text_char_limit_1000/index'

const richTextCharLimitProps: WysiwygProps = {
  id: 1,
  html: [
    '<p>You may be eligible for VA disability benefits if you meet both of the requirements listed below.</p>\n<p><strong>Both of these must be true. You: </strong></p>\n<ul>\n<li>Have an illness we believe is caused by contact with Agent Orange (called a presumptive disease), <strong>and</strong></li>\n<li>Served in a location or job that put you in contact with Agent Orange (called having a presumption of contact) </li>\n</ul>\n<p>Read the full eligibility requirements for presumptive diseases and presumption of contact below.</p>\n',
  ],
}

describe('ParagraphRichTextCharLimit1000 with valid data', () => {
  test('correctly renders ParagraphRichTextCharLimit1000 component', () => {
    {
      render(<RichTextCharLimit1000 {...richTextCharLimitProps} />)
    }
    expect(
      screen.queryByText(/You may be eligible for VA disability benefits/)
    ).toBeInTheDocument()
    screen.debug()
  })
})

describe('ParagraphRichTextCharLimit1000 with invalid data', () => {
  test('does not render ParagraphRichTextCharLimit1000 when data is null', () => {
    richTextCharLimitProps.html = null
    {
      render(<RichTextCharLimit1000 {...richTextCharLimitProps} />)
    }
    expect(
      screen.queryByText(/You may be eligible for VA disability benefits/)
    ).not.toBeInTheDocument()
  })
})

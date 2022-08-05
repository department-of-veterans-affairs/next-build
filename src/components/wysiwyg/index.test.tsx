import { render, screen } from '@testing-library/react'
import { ParagraphWysiwyg } from '@/types/paragraph'
import Wysiwyg from '@/components/wysiwyg/index'
import { drupalToVaPath, phoneLinks } from '@/utils/helpers'

const paragraph: ParagraphWysiwyg = {
  type: 'paragraph--wysiwyg',
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'paragraph',
  field_wysiwyg: {
    format: 'rich_text',
    processed: 'If you need support...',
    value: 'null',
  },
  drupal_internal__id: 123,
  drupal_internal__revision_id: 1,
  langcode: 'en',
  status: true,
}

describe.skip('ParagraphWysiwyg with valid data', () => {
  test('correctly renders ParagraphWysiwyg component', () => {
    render(<Wysiwyg paragraph={paragraph} />)
    expect(screen.queryByText(/If you need support.../)).toBeInTheDocument()
  })
})

describe('drupalToVaPath', () => {
  test('converts image url to /img/', () => {
    paragraph.field_wysiwyg.processed =
      '<a href="http://staging.cms.va.gov/sites/default/files/cat.jpg">jpg image</a>'
    const content = drupalToVaPath(paragraph.field_wysiwyg?.processed)
    expect(content).toEqual('<a href="/img/cat.jpg">jpg image</a>')
  })
  test('converts document url to /files/', () => {
    paragraph.field_wysiwyg.processed =
      '<a href="https://prod.cms.va.gov/sites/default/files/cat.doc">document</a>'
    const content = drupalToVaPath(paragraph.field_wysiwyg?.processed)
    expect(content).toEqual('<a href="/files/cat.doc">document</a>')
  })
})

describe('phoneLinks', () => {
  test('wraps text phone numbers in a link', () => {
    paragraph.field_wysiwyg.processed =
      'Here is a phone number: 123-456-7890. Pretty cool!'
    const expected =
      'Here is a phone number: <a target="_blank" href="tel:123-456-7890">123-456-7890</a>. Pretty cool!'
    expect(phoneLinks(paragraph.field_wysiwyg?.processed)).toEqual(expected)
  })

  test('wraps phone numbers with parentheses around the area code', () => {
    paragraph.field_wysiwyg.processed =
      'Here is a phone number: (123)-456-7890. Pretty cool!'
    const expected =
      'Here is a phone number: <a target="_blank" href="tel:123-456-7890">123-456-7890</a>. Pretty cool!'
    expect(phoneLinks(paragraph.field_wysiwyg?.processed)).toEqual(expected)
  })

  test('wraps phone numbers with space after the area code', () => {
    paragraph.field_wysiwyg.processed =
      'Here is a phone number: (123) 456-7890. Pretty cool!'
    const expected =
      'Here is a phone number: <a target="_blank" href="tel:123-456-7890">123-456-7890</a>. Pretty cool!'
    expect(phoneLinks(paragraph.field_wysiwyg?.processed)).toEqual(expected)
  })
})

describe('ParagraphWysiwyg with invalid data', () => {
  test('does not render ParagraphWysiwyg when data is null', () => {
    paragraph.field_wysiwyg = null
    render(<Wysiwyg paragraph={paragraph} />)
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })
})

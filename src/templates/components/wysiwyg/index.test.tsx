import { render, screen } from '@testing-library/react'
import { Wysiwyg, WysiwygField } from './index'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'
import { drupalToVaPath } from '@/lib/utils/helpers'
import { ParagraphComponent } from '@/types/formatted/paragraph'

const wysiwygProps: ParagraphComponent<FormattedWysiwyg> = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  html: 'If you need support...',
  className: '',
}

describe('ParagraphWysiwyg with valid data', () => {
  test('correctly renders ParagraphWysiwyg component', () => {
    render(<Wysiwyg key={wysiwygProps.id} {...wysiwygProps} />)
    expect(screen.queryByText(/If you need support.../)).toBeInTheDocument()
  })
})

describe('drupalToVaPath', () => {
  test('converts image url to /img/', () => {
    wysiwygProps.html =
      '<a href="http://staging.cms.va.gov/sites/default/files/cat.jpg">jpg image</a>'
    const content = drupalToVaPath(wysiwygProps.html)
    expect(content).toEqual('<a href="/img/cat.jpg">jpg image</a>')
  })
  test('converts document url to /files/', () => {
    wysiwygProps.html =
      '<a href="https://prod.cms.va.gov/sites/default/files/cat.doc">document</a>'
    const content = drupalToVaPath(wysiwygProps.html)
    expect(content).toEqual('<a href="/files/cat.doc">document</a>')
  })
})

describe('ParagraphWysiwyg with invalid data', () => {
  test('does not render ParagraphWysiwyg when data is null', () => {
    wysiwygProps.html = null
    render(<Wysiwyg key={wysiwygProps.id} {...wysiwygProps} />)
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })
})

describe('WysiwygField', () => {
  test('returns if invalid data passed', () => {
    const html = null
    const element = WysiwygField({ html })
    expect(element).toBe(undefined)
  })
})

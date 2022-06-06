import { render, screen } from '@testing-library/react'
import { Paragraph } from '@/components/paragraph'
import { ParagraphButton } from '@/types/paragraph'

const paragraph: ParagraphButton = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  type: 'paragraph--button',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'paragraph',
  parent_field_name: 'field_buttons',
  field_button_label: 'Sign in now',
  field_button_link: {
    uri: 'https://www.va.gov/?next=sign-in-faq',
    title: 'test',
    options: null,
  },
  drupal_internal__id: 123,
  drupal_internal__revision_id: 1,
  langcode: 'en',
  status: true,
}

describe('Button with valid data', () => {
  test('renders Button component', () => {
    render(<Paragraph paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.va.gov/?next=sign-in-faq'
    )
  })
})

describe('Button with invalid data', () => {
  test('does not render Button component when label and link are not present', () => {
    paragraph.field_button_label = null
    paragraph.field_button_link = null

    render(<Paragraph paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when label is not present', () => {
    paragraph.field_button_label = null
    paragraph.field_button_link = {
      uri: 'https://www.va.gov/?next=sign-in-faq',
      title: 'test',
      options: null,
    }
    render(<Paragraph paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when link is not present', () => {
    paragraph.field_button_link = null
    paragraph.field_button_label = 'Sign in now'
    render(<Paragraph paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when uri is not present', () => {
    paragraph.field_button_link = {
      uri: null,
      title: 'test',
      options: null,
    }
    paragraph.field_button_label = 'Sign in now'
    render(<Paragraph paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })
})

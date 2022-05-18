import { render, screen } from '@testing-library/react'

import LinkTeaser from './index'

const paragraph = {
  type: 'paragraph--button',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'node',
  parent_field_name: 'field_buttons',
  field_button_label: 'Sign in now',
  field_button_link: {
    uri: 'https://www.va.gov/?next=sign-in-faq',
    title: 'test',
  },
}

describe('LinkTeaser with valid data', () => {
  test('renders LinkTeaser component', () => {
    render(<LinkTeaser paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.va.gov/?next=sign-in-faq'
    )
  })
})

describe('LinkTeaser with invalid data', () => {
  test('does not render LinkTeaser component when label and link are not present', () => {
    paragraph.field_button_label = null
    paragraph.field_button_link = null

    render(<LinkTeaser paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render LinkTeaser component when label is not present', () => {
    paragraph.field_button_label = null
    paragraph.field_button_link = {
      uri: 'https://www.va.gov/?next=sign-in-faq',
      title: 'test',
    }
    render(<LinkTeaser paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render LinkTeaser component when link is not present', () => {
    paragraph.field_button_link = null
    paragraph.field_button_label = 'Sign in now'
    console.log('paragraph ', paragraph)
    render(<LinkTeaser paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render LinkTeaser component when uri is not present', () => {
    paragraph.field_button_link = {
      uri: null,
      title: 'test',
    }
    paragraph.field_button_label = 'Sign in now'
    console.log('paragraph ', paragraph)
    render(<LinkTeaser paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })
})

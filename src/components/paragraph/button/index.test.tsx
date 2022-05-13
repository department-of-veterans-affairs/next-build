import { render, screen } from '@testing-library/react'

import Button from './index'

const paragraph = {
  type: 'paragraph--button',
  created: '2020-10-16T20:09:53+00:00',
  parent_id: '8475',
  parent_type: 'node',
  parent_field_name: 'field_buttons',
  field_button_label: 'Sign in now',
  field_button_link: {
    uri: 'https://www.va.gov/?next=sign-in-faq',
  },
}

describe('Button with valid data', () => {
  test('renders Button component', () => {
    render(<Button paragraph={paragraph} />)

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

    render(<Button paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when label is not present', () => {
    paragraph.field_button_label = null
    paragraph.field_button_link = {
      uri: 'https://www.va.gov/?next=sign-in-faq',
    }
    render(<Button paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when link is not present', () => {
    paragraph.field_button_link = null
    paragraph.field_button_label = 'Sign in now'
    console.log('paragraph ', paragraph)
    render(<Button paragraph={paragraph} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })
})

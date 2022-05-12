import { render, screen } from '@testing-library/react'

import Button from './index'

describe('Button with valid data', () => {
  const MOCK_PARAGRAPH = {
    type: 'paragraph--button',
    created: '2020-10-16T20:09:53+00:00',
    parent_id: '8475',
    parent_type: 'node',
    parent_field_name: 'field_buttons',
    field_button_label: 'Sign in now',
    field_button_link: {
      uri: 'https://www.va.gov/?next=sign-in-faq',
      title: '',
      options: [],
    },
  }

  test('renders Button component', () => {
    render(<Button paragraph={MOCK_PARAGRAPH} />)

    expect(screen.queryByText(/Sign in now/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.va.gov/?next=sign-in-faq'
    )
  })
})

describe('Button without valid data', () => {
  const MOCK_PARAGRAPH = {
    type: 'paragraph--button',
    created: '2020-10-16T20:09:53+00:00',
    parent_id: '8475',
    parent_type: 'node',
    parent_field_name: 'field_buttons',
    field_button_label: null,
    field_button_link: null,
  }

  test('renders Button component', () => {
    render(<Button paragraph={MOCK_PARAGRAPH} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })
})

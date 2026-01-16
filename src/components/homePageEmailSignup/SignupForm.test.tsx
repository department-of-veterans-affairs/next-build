import React from 'react'
import { render, screen } from '@testing-library/react'
import { SignupForm } from './SignupForm'
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

jest.mock(
  '@department-of-veterans-affairs/component-library/dist/react-bindings',
  () => ({
    VaTextInput: ({
      'form-heading': formHeading,
      ...props
    }: React.ComponentProps<typeof VaTextInput>) => {
      // Filter out web component attributes that React doesn't recognize
      const {
        autocomplete,
        charcount,
        class: className,
        'form-heading': _formHeading,
        'form-heading-level': _formHeadingLevel,
        inputmode,
        maxlength,
        'use-forms-pattern': _useFormsPattern,
        ...restProps
      } = props

      return React.createElement('div', {
        'data-testid': 'va-text-input',
        'data-form-heading': formHeading,
        ...restProps,
      })
    },
  })
)

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders form with correct action and method', () => {
    const { container } = render(<SignupForm />)
    const form = container.querySelector('#email-signup-form')

    expect(form).toHaveAttribute(
      'action',
      'https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify'
    )
    expect(form).toHaveAttribute('method', 'POST')
  })

  test('renders hidden form fields', () => {
    const { container } = render(<SignupForm />)

    expect(container.querySelector('input[name="utf8"]')).toHaveValue('✓')
    expect(container.querySelector('#category_id_top')).toHaveValue(
      'USVACHOOSE_C1'
    )
    expect(container.querySelector('#homepage-hidden-email')).toHaveValue('')
  })

  test('renders VaTextInput component', () => {
    render(<SignupForm />)

    const textInput = screen.getByTestId('va-text-input')
    expect(textInput).toBeInTheDocument()
    expect(textInput).toHaveAttribute(
      'data-form-heading',
      'Sign up to get the latest VA updates'
    )
  })

  test('renders va-button', () => {
    const { container } = render(<SignupForm />)
    const button = container.querySelector('va-button')

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('text', 'Sign up')
  })
})

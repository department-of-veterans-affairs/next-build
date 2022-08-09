import { render, screen } from '@testing-library/react'
import { Button, ButtonProps } from './index'

const buttonProps: ButtonProps = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  label: 'Sign in now',
  url: 'https://www.va.gov/?next=sign-in-faq',
}

describe('Button with valid data', () => {
  test('renders Button component', () => {
    render(<Button key={buttonProps.id} {...buttonProps} />)

    expect(screen.queryByText(/Sign in now/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.va.gov/?next=sign-in-faq'
    )
  })
})

describe('Button with invalid data', () => {
  test('does not render Button component when label and url is not present', () => {
    buttonProps.label = null
    buttonProps.url = ''

    render(<Button key={buttonProps.id} {...buttonProps} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when label is not present', () => {
    buttonProps.label = null
    buttonProps.url = 'https://www.va.gov/?next=sign-in-faq'
    render(<Button key={buttonProps.id} {...buttonProps} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })

  test('does not render Button component when url is not present', () => {
    buttonProps.url = ''
    buttonProps.label = 'Sign in now'
    render(<Button key={buttonProps.id} {...buttonProps} />)

    expect(screen.queryByText(/Sign in now/)).not.toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { HomePageEmailSignup } from './template'

describe('HomePageEmailSignup', () => {
  test('renders SignupForm component', () => {
    const { container } = render(<HomePageEmailSignup />)
    expect(container.querySelector('.email-signup-form')).toBeInTheDocument()
  })

  test('renders veteran banner section', () => {
    const { container } = render(<HomePageEmailSignup />)

    const banner = container.querySelector('#vets-banner-1')
    expect(banner).toBeInTheDocument()
  })

  test('renders veteran banner image with correct attributes', () => {
    const { container } = render(<HomePageEmailSignup />)

    const picture = container.querySelector('picture')
    expect(picture).toBeInTheDocument()

    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('alt', 'Veteran portraits')
    expect(img).toHaveClass('vads-u-width--full')
  })

  test('has correct test id', () => {
    const { container } = render(<HomePageEmailSignup />)

    const wrapper = container.querySelector('.homepage-email-update-wrapper')
    expect(wrapper).toHaveAttribute('data-testid', 'home-page-email-signup')
  })
})

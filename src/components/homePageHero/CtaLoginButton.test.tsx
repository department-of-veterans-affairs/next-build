import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CtaLoginButton } from './CtaLoginButton'

describe('CtaLoginButton', () => {
  it('renders with the given text', () => {
    render(<CtaLoginButton text="Sign In" />)
    expect(screen.getByTestId('ctaButton')).toHaveAttribute('text', 'Sign In')
  })

  it('calls window.location.replace with next=loginModal when clicked', () => {
    window.history.pushState({}, '', '/')

    // jsdom's Location uses non-configurable properties; spy on the internal impl
    const implSymbol = Reflect.ownKeys(window.location).find(
      (k) => typeof k === 'symbol'
    ) as symbol
    const replaceSpy = jest
      .spyOn(
        (
          window.location as unknown as {
            [k: symbol]: { replace: (url: string) => void }
          }
        )[implSymbol],
        'replace'
      )
      .mockImplementation(() => {})

    render(<CtaLoginButton text="Sign In" />)
    fireEvent.click(screen.getByTestId('ctaButton'))

    expect(replaceSpy).toHaveBeenCalledWith('/?next=loginModal')
    replaceSpy.mockRestore()
  })
})

'use client'

interface CtaLoginButtonProps {
  text: string
}

export function CtaLoginButton({ text }: CtaLoginButtonProps) {
  return (
    <va-button
      className="vads-u-margin-bottom--3"
      data-testid="ctaButton"
      text={text}
      onClick={() => {
        const params = new URLSearchParams(window.location.search)
        params.set('next', 'loginModal')
        window.location.replace(
          `${window.location.pathname}?${params.toString()}`
        )
      }}
    />
  )
}

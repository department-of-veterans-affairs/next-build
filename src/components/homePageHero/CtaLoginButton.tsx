'use client'

import { useRouter } from 'next/navigation'

interface CtaLoginButtonProps {
  text: string
}

export function CtaLoginButton({ text }: CtaLoginButtonProps) {
  const router = useRouter()

  return (
    <va-button
      className="vads-u-margin-bottom--3"
      data-testid="ctaButton"
      text={text}
      onClick={() => {
        const params = new URLSearchParams(window.location.search)
        params.set('next', 'loginModal')
        router.push(`?${params.toString()}`)
      }}
    />
  )
}

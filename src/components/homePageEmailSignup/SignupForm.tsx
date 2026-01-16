'use client'

import { useEffect, useRef, useState } from 'react'
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { isValidEmail } from '@/lib/utils/helpers'

export function SignupForm() {
  const [inputError, setInputError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const headerHasFocusedRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const getInputShadowRoot = (): ShadowRoot | null => {
    const textInput = formRef.current?.querySelector('va-text-input')
    return textInput?.shadowRoot || null
  }

  // Style the character count message in the va-text-input shadow DOM
  // This runs once on mount to apply custom styling to the shadow root
  useEffect(() => {
    const shadowRoot = getInputShadowRoot()
    if (!shadowRoot) return

    const charCountStyle = document.createElement('style')

    charCountStyle.textContent = `
        #charcount-message {
          color: #565c65;
        }
      `

    shadowRoot.appendChild(charCountStyle)
  })

  // Handle accessibility: Focus the form heading when validation errors occur
  // This ensures screen readers announce errors by focusing the heading element
  // The flag prevents repeated focusing while an error persists, but resets when error clears
  useEffect(() => {
    const shadowRoot = getInputShadowRoot()
    const inputHeader = shadowRoot?.querySelector('h2')
    if (!inputHeader) return

    // Reset the flag when error clears, so header can be focused again on new errors
    if (!inputError) {
      headerHasFocusedRef.current = false
      return
    }

    // Only focus header if there's an error and we haven't focused it yet
    if (!headerHasFocusedRef.current) {
      inputHeader.addEventListener('focus', () => {
        ;(inputHeader as HTMLElement).style.outline = 'none'
      })

      inputHeader.setAttribute('tabindex', '-1')
      inputHeader.focus()
      headerHasFocusedRef.current = true
    }
  }, [inputError])

  const setInputErrorState = () => {
    if (!email || !email?.length || !isValidEmail(email)) {
      setInputError(
        `Enter a valid email address without spaces using this format: email@domain.com`
      )
    } else {
      setInputError(null)
    }
  }

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)

    if (inputError) {
      setInputErrorState()
    }
  }

  const onSignup = () => {
    setInputErrorState()

    if (email?.length && isValidEmail(email)) {
      recordEvent({
        event: 'homepage-email-sign-up',
        'button-click-label': 'Sign up',
      })

      formRef.current?.requestSubmit()
    }
  }

  return (
    <div className="email-signup-form">
      <form
        ref={formRef}
        acceptCharset="UTF-8"
        action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify"
        id="email-signup-form"
        method="POST"
      >
        <input type="hidden" name="utf8" value="✓" />
        <input
          type="hidden"
          name="category_id"
          id="category_id_top"
          value="USVACHOOSE_C1"
        />
        <input
          type="hidden"
          name="email"
          id="homepage-hidden-email"
          value={email}
        />
        <VaTextInput
          autocomplete="email"
          charcount
          class="homepage-email-input"
          error={inputError || null}
          form-heading="Sign up to get the latest VA updates"
          form-heading-level="2"
          inputmode="email"
          label="Email address"
          maxlength={130}
          onBlur={setInputErrorState}
          onInput={onInput}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
              onSignup()
            }
          }}
          required
          type="email"
          use-forms-pattern="single"
          value={email}
        />
        <va-button
          disable-analytics
          className="vads-u-margin-y--2p5"
          onClick={(event: Event) => {
            event.preventDefault()
            onSignup()
          }}
          text="Sign up"
        />
      </form>
    </div>
  )
}

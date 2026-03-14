'use client'

import { MouseEvent, useRef, useState } from 'react'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

const RATING_OPTIONS_QUESTION = 'How do you rate your experience on this page?'

const enum RatingOption {
  Good = 'Good',
  Bad = 'Bad',
}

/* RateYourExperience */
export const RateYourExperience = () => {
  const [rating, setRating] = useState<RatingOption | null>(null)
  const [isError, setIsError] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const thankYouRef = useRef<HTMLParagraphElement>(null)

  const handleRatingChange = (event: CustomEvent<{ value: string }>) => {
    setIsError(false)
    setRating(event.detail.value as RatingOption)
  }

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault()

    if (!rating) {
      setIsError(true)
      return
    }

    if (process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD) {
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label': RATING_OPTIONS_QUESTION,
        'radio-button-optionLabel': rating,
        'radio-button-required': false,
      })
    }

    setIsSubmitted(true)
    thankYouRef.current?.focus()
  }

  const handleSurveyClick = () => {
    const pathname =
      typeof window !== 'undefined' ? window.location.pathname : ''
    const isProduction = process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD
    const surveyNumber = getSurveyNumber(pathname, isProduction)
    showForm(surveyNumber)
  }

  return (
    <div
      className="vads-u-padding-top--3 vads-u-padding-bottom--1 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0"
      data-template="includes/how-do-you-rate"
      id="how-do-you-rate-form"
    >
      <VaRadio
        id="rating-radio"
        label={RATING_OPTIONS_QUESTION}
        label-header-level="2"
        error={isError ? 'Please select an answer' : ''}
        onVaValueChange={handleRatingChange}
      >
        <VaRadioOption id="good" label="Good" name="rating" value="Good" />
        <VaRadioOption id="bad" label="Bad" name="rating" value="Bad" />
      </VaRadio>

      <div>
        <va-button
          disable-analytics
          secondary
          className={`vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5 ${isSubmitted ? 'vads-u-display--none' : ''}`}
          aria-hidden={isSubmitted}
          id="rating-submit"
          onClick={handleSubmit}
          text="Submit feedback"
        />
      </div>

      <p
        ref={thankYouRef}
        aria-hidden={!isSubmitted}
        aria-live="assertive"
        id="thank-you-message"
        className={`vads-u-display--${isSubmitted ? 'block' : 'none'} vads-u-margin--0`}
        tabIndex={-1}
      >
        Want to share more feedback? We&apos;ll use it to keep improving VA.gov
        for all Veterans and their families.{' '}
        <button
          onClick={handleSurveyClick}
          type="button"
          className="va-button-link"
        >
          Complete our 3-question survey.
        </button>
      </p>
    </div>
  )
}

import { MouseEvent, useState } from 'react'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export const RateYourExperience = () => {
  const header = 'How do you rate your experience on this page?'
  const [rating, setRating] = useState(null)
  const [isError, setIsError] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleRatingChange = (ratingOption: string) => {
    setIsError(false)
    setRating(ratingOption)
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!rating) {
      setIsError(true)
      return
    }

    if (process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD) {
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label': header,
        'radio-button-optionLabel': rating,
        'radio-button-required': false,
      })
    }

    setIsSubmitted(true)
  }

  const handleSurveyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const isProduction = process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD

    const surveyNumber = getSurveyNumber(window.location.pathname, isProduction)

    showForm(surveyNumber)
  }

  return (
    <form className="vads-u-margin-top--3 vads-u-margin-bottom--4 vads-u-display--flex vads-u-flex-direction--column">
      <VaRadio
        error={isError ? 'Please select an answer' : ''}
        aria-hidden={isSubmitted}
        label={header}
        label-header-level="2"
        onVaValueChange={(e) => handleRatingChange(e.detail.value)}
      >
        <VaRadioOption
          checked={rating === 'Good'}
          id="Good"
          label="Good"
          name="rating"
          value="Good"
        />
        <VaRadioOption
          checked={rating === 'Bad'}
          id="Bad"
          label="Bad"
          name="rating"
          value="Bad"
        />
      </VaRadio>

      <va-button
        aria-hidden={isSubmitted}
        class={`vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5 ${!isSubmitted ? '' : 'vads-u-display--none'}`}
        disable-analytics
        onClick={handleSubmit}
        secondary
        text="Submit feedback"
      />
      <p
        aria-hidden={!isSubmitted}
        id="rate-your-experience--thank-you-message"
        className={`vads-u-margin-bottom-0 ${isSubmitted ? 'vads-u-display--block' : 'vads-u-display--none'}`}
      >
        Want to share more feedback? We&apos;ll use it to keep improving VA.gov
        for all Veterans and their families.&nbsp;
        <button
          onClick={handleSurveyClick}
          type="button"
          className="va-button-link"
        >
          Complete our 3-question survey.
        </button>
      </p>
    </form>
  )
}

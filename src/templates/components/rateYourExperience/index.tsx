import { MouseEvent, ChangeEvent, useState } from 'react'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { VaRadio, VaRadioOption } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

const RatingButton = ({
  rating,
  isChecked,
  onChange,
}: {
  rating: RatingOption
  isChecked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <va-radio-option
      class="hydrated"
      label={rating}
      name="rating"
      value={rating}
      checked={isChecked}
    />
  )
}

const SubmitButton = ({
  isActive,
  onClick,
}: {
  isActive: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}) => (
  <va-button
    class={`vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5 ${isActive ? '' : 'vads-u-display--none'}`}
    aria-hidden={!isActive}
    onClick={onClick}
    secondary
    text="Submit feedback"
  />
)

export const RateYourExperience = () => {
  const header = 'How do you rate your experience on this page?'
  const [rating, setRating] = useState<RatingOption>(null)
  const [isError, setIsError] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleRatingChange = (ratingOption: RatingOption) => {
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

    const surveyNumber = getSurveyNumber(
      window.location.pathname,
      isProduction
    )

    showForm(surveyNumber)
  }

  return (
    <form className="vads-u-padding-top--3 vads-u-padding-bottom--1 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
      <VaRadio
        error={isError ? 'Please select an answer' : ''}
        class="hydrated"
        aria-hidden={isSubmitted}
        label={header}
        label-header-level="2"
      >
        <VaRadioOption
          checked={rating === 'Good'}
          class="hydrated"
          id="Good"
          label="Good"
          name="rating"
          onChange={() => handleRatingChange('Good')}
          value="Good"
        />
        <VaRadioOption
          checked={rating === 'Bad'}
          class="hydrated"
          id="Bad"
          label="Bad"
          name="rating"
          onChange={() => handleRatingChange('Bad')}
          value="Bad"
        />
      </VaRadio>

      <SubmitButton isActive={!isSubmitted} onClick={handleSubmit} />
      <p
        aria-hidden={!isSubmitted}
        id="rate-your-experience--thank-you-message"
        className={`vads-u-margin-bottom-0 ${isSubmitted ? 'vads-u-display--block' : 'vads-u-display--none'}`}
      >
        Want to share more feedback? We&apos;ll use it to keep improving VA.gov for all Veterans and their families.&nbsp;
        <va-button
          onClick={handleSurveyClick}
          type="button"
          class="va-button-link"
          text="Complete our 3-question survey."
        />
      </p>
    </form>
  )
}

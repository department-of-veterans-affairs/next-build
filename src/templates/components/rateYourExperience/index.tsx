import { MouseEvent, ChangeEvent, useState } from 'react'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { recordEvent } from '@/lib/analytics/recordEvent'

const enum RatingOption {
  Good = 'Good',
  Bad = 'Bad',
}

const RatingButton = ({
  rating,
  isChecked,
  onChange,
}: {
  rating: RatingOption
  isChecked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
  const buttonId = `rate-your-experience--${rating.toLowerCase()}`
  return (
    <div className="radio-button">
      <input
        id={buttonId}
        name="rating"
        type="radio"
        value={rating}
        checked={isChecked}
        onChange={onChange}
      />
      <label
        className="vads-u-margin--0 vads-u-margin-right--2"
        htmlFor={buttonId}
      >
        {rating}
      </label>
    </div>
  )
}

const SubmitButton = ({
  isActive,
  onClick,
}: {
  isActive: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}) => (
  <div>
    <button
      className={`usa-button usa-button-secondary vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5 ${isActive ? '' : 'vads-u-display--none'}`}
      aria-hidden={!isActive}
      id="rate-your-experience--rating-submit"
      type="submit"
      onClick={onClick}
    >
      Submit feedback
    </button>
  </div>
)

const ErrorMessage = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`usa-input-error-message ${isActive ? '' : 'vads-u-display--none'}`}
    aria-hidden={!isActive}
    role="alert"
    id="rate-your-experience--error-message"
  >
    <span className="sr-only">Error</span> Please select an answer
  </span>
)

const ThankYouMessage = ({ isActive }: { isActive: boolean }) => (
  <p
    aria-hidden={!isActive}
    aria-live="assertive"
    id="rate-your-experience--thank-you-message"
    className={`vads-u-margin--0 ${isActive ? 'vads-u-display--block' : 'vads-u-display--none'}`}
  >
    Thank you for your feedback.
  </p>
)

/* RateYourExperience */
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

  return (
    <form
      className="vads-u-padding-top--3 vads-u-padding-bottom--1 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 large-screen:vads-u-padding-x--0"
      data-template="includes/how-do-you-rate"
      id="how-do-you-rate-form"
    >
      <fieldset
        id="rating-options"
        className={`fieldset-input vads-u-margin-top--1 ${isError ? 'usa-input-error' : ''}`}
      >
        <legend>
          <h2 className="vads-u-margin--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3">
            {header}
          </h2>
        </legend>

        <ErrorMessage isActive={isError} />

        <div
          id="rating-buttons"
          className={`form-radio-buttons vads-u-align-items--center ${isSubmitted ? 'vads-u-display--none' : 'vads-u-display--flex'}`}
          aria-hidden={isSubmitted}
        >
          <RatingButton
            rating={RatingOption.Good}
            isChecked={rating === RatingOption.Good}
            onChange={() => handleRatingChange(RatingOption.Good)}
          />
          <RatingButton
            rating={RatingOption.Bad}
            isChecked={rating === RatingOption.Bad}
            onChange={() => handleRatingChange(RatingOption.Bad)}
          />
        </div>
      </fieldset>

      <SubmitButton isActive={!isSubmitted} onClick={handleSubmit} />

      <ThankYouMessage isActive={isSubmitted} />
    </form>
  )
}

import { MouseEvent, ChangeEvent, useState } from 'react'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'

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
  return (
    <va-radio-option
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
    className={`usa-button usa-button-secondary vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5 ${isActive ? '' : 'vads-u-display--none'}`}
    aria-hidden={!isActive}
    onClick={onClick}
    secondary
  >
    Submit feedback
  </va-button>
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
    id="rate-your-experience--thank-you-message"
    className={`vads-u-margin-bottom-0 ${isActive ? 'vads-u-display--block' : 'vads-u-display--none'}`}
  >
    Want to share more feedback? We'll use it to keep improving VA.gov for all Veterans and their families.&nbsp;
    <button
      // onClick={KAMPYLE_ONSITE_SDK.showForm('{{ buildtype | getSurvey: entityUrl.path }}')}
      type="button"
      className="va-button-link"
    >
      Complete our 3-question survey.
    </button>
  </p>
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

    const isProduction = process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD

    const surveyNumber = getSurveyNumber(
      window.location.pathname,
      isProduction
    )

    showForm(surveyNumber)

    setIsSubmitted(true)
  }

  return (
    <form
      className="vads-u-padding-top--3 vads-u-padding-bottom--1 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0"
      data-template="includes/how-do-you-rate"
      id="how-do-you-rate-form"
    >
      <fieldset
        id="rating-options"
        className={`fieldset-input vads-u-margin-top--1 ${isError ? 'usa-input-error' : ''}`}
      >
        <ErrorMessage isActive={isError} />

        <div
          className="vads-u-padding-top--3 vads-u-padding-bottom--1 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0"
          aria-hidden={isSubmitted}
        >
          <va-radio
            label={header}
            label-header-level="2"
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
          </va-radio>
        </div>
      </fieldset>

      <SubmitButton isActive={!isSubmitted} onClick={handleSubmit} />

      <ThankYouMessage isActive={isSubmitted} />
    </form>
  )
}

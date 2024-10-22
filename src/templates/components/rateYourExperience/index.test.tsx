import { render } from '@testing-library/react'
import { RateYourExperience } from './index'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/react'
import { screen } from '@testing-library/dom'

describe('<RateYourExperience>', () => {
  test('renders <RateYourExperience />', () => {
    const { queryByText } = render(<RateYourExperience />)

    const good = document.querySelector('#Good')
    const bad = document.querySelector('#Bad')
    const radioHeader = document.querySelector('[label="How do you rate your experience on this page?')
    const submitButton = document.querySelector('va-button[text="Submit feedback"]')

    expect(radioHeader).toBeInTheDocument()
    expect(good).toBeInTheDocument()
    expect(bad).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  test.only('shows error message when submitted without selection', async () => {
    const user = userEvent.setup()
    const { screen } = render(<RateYourExperience />)

    const submitButton = document.querySelector('va-button[text="Submit feedback"]')
    const errorMessage = document.querySelector('va-radio[error="Please select an answer"]')

    expect(submitButton).toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    user.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText(/Please select an answer/)).toBeInTheDocument()
      expect(errorMessage).toBeInTheDocument()
    })
  })

  test('shows thank-you message when submitted with selection', async () => {
    const user = userEvent.setup()
    const { screen } = render(<RateYourExperience />)

    const goodRatingInput = document.querySelector(
      '#Good'
    )
    const submitButton = document.querySelector(
      'va-button[text="Submit feedback"]'
    )
    const thankYouMessage = document.querySelector(
      '#rate-your-experience--thank-you-message'
    )
    expect(thankYouMessage).toBeInTheDocument()
    expect(thankYouMessage).toHaveClass('vads-u-display--none')

    user.click(goodRatingInput)
    await waitFor(() => expect(goodRatingInput).toBeChecked())

    user.click(submitButton)
    await waitFor(() =>
      expect(thankYouMessage).not.toHaveClass('vads-u-display--none')
    )
  })
})

import { render } from '@testing-library/react'
import { RateYourExperience } from './index'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/react'
import { screen } from '@testing-library/dom'

describe('<RateYourExperience>', () => {
  test('renders <RateYourExperience />', () => {
    const { queryByText } = render(<RateYourExperience />)

    const good = document.querySelector('#rate-your-experience--good')
    const bad = document.querySelector('#rate-your-experience--bad')

    expect(
      queryByText(/How do you rate your experience on this page?/)
    ).toBeInTheDocument()
    expect(good).toBeInTheDocument()
    expect(bad).toBeInTheDocument()
  })

  test('shows error message when submitted without selection', async () => {
    const user = userEvent.setup()
    render(<RateYourExperience />)

    const submitButton = document.querySelector(
      '#rate-your-experience--rating-submit'
    )
    const errorMessage = document.querySelector(
      '#rate-your-experience--error-message'
    )
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('vads-u-display--none')

    user.click(submitButton)
    await waitFor(() =>
      expect(errorMessage).not.toHaveClass('vads-u-display--none')
    )
  })

  test('shows thank-you message when submitted with selection', async () => {
    const user = userEvent.setup()
    render(<RateYourExperience />)

    const goodRatingInput = document.querySelector(
      '#rate-your-experience--good'
    )
    const submitButton = document.querySelector(
      '#rate-your-experience--rating-submit'
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

import { act, render } from '@testing-library/react'
import { axe } from '@/test-utils'
import { RateYourExperience } from './template'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { openFeedbackForm } from '@/lib/utils/medallia'

jest.mock('@/lib/utils/medallia', () => ({
  openFeedbackForm: jest.fn(),
}))

describe('<RateYourExperience>', () => {
  beforeEach(() => {
    jest.mocked(openFeedbackForm).mockClear()
  })

  test('renders <RateYourExperience />', async () => {
    const { container } = render(<RateYourExperience />)

    const vaRadio = container.querySelector('va-radio')
    const goodOption = container.querySelector('#good')
    const badOption = container.querySelector('#bad')

    expect(vaRadio).toBeInTheDocument()
    expect(vaRadio?.getAttribute('label')).toBe(
      'How do you rate your experience on this page?'
    )
    expect(goodOption).toBeInTheDocument()
    expect(badOption).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('shows error message when submitted without selection', async () => {
    const user = userEvent.setup()
    const { container } = render(<RateYourExperience />)

    const submitButton = container.querySelector('#rating-submit')
    const vaRadio = container.querySelector('va-radio')

    expect(vaRadio?.getAttribute('error')).toBe('')

    await user.click(submitButton!)

    await waitFor(() =>
      expect(vaRadio?.getAttribute('error')).toBe('Please select an answer')
    )
  })

  test('shows thank-you message when submitted with selection', async () => {
    const user = userEvent.setup()
    const { container } = render(<RateYourExperience />)

    const vaRadio = container.querySelector('va-radio')
    const submitButton = container.querySelector('#rating-submit')
    const thankYouMessage = container.querySelector('#thank-you-message')

    expect(thankYouMessage).toBeInTheDocument()
    expect(thankYouMessage).toHaveClass('vads-u-display--none')

    // Simulate vaValueChange event (va-radio-option click may not work in jsdom)
    await act(async () => {
      vaRadio?.dispatchEvent(
        new CustomEvent('vaValueChange', { detail: { value: 'Good' } })
      )
    })

    await user.click(submitButton!)

    await waitFor(() => {
      expect(thankYouMessage).not.toHaveClass('vads-u-display--none')
      expect(thankYouMessage).toHaveTextContent(/Want to share more feedback\?/)
      expect(thankYouMessage).toHaveTextContent(
        /Complete our 3-question survey/
      )
    })
  })

  test('calls openFeedbackForm when survey link is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<RateYourExperience />)

    const vaRadio = container.querySelector('va-radio')
    const submitButton = container.querySelector('#rating-submit')

    await act(async () => {
      vaRadio?.dispatchEvent(
        new CustomEvent('vaValueChange', { detail: { value: 'Good' } })
      )
    })
    await user.click(submitButton!)

    const surveyButton = container.querySelector(
      '#thank-you-message .va-button-link'
    )
    await user.click(surveyButton!)

    expect(openFeedbackForm).toHaveBeenCalledTimes(1)
  })
})

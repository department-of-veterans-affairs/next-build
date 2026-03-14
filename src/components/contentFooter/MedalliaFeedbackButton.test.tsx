import { render } from '@testing-library/react'
import { axe } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import { MedalliaFeedbackButton } from './MedalliaFeedbackButton'
import { openFeedbackForm } from '@/lib/utils/medallia'

jest.mock('@/components/medallia/template', () => ({
  MedalliaAssets: jest.fn().mockReturnValue(null),
}))

jest.mock('@/lib/utils/medallia', () => ({
  openFeedbackForm: jest.fn(),
}))

describe('<MedalliaFeedbackButton>', () => {
  beforeEach(() => {
    jest.mocked(openFeedbackForm).mockClear()
  })

  test('renders Feedback button and passes axe', async () => {
    const { container } = render(<MedalliaFeedbackButton />)

    const feedbackButton = container.querySelector('#mdFormButton')
    expect(feedbackButton).toBeInTheDocument()
    expect(feedbackButton?.getAttribute('text')).toBe('Feedback')

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('calls openFeedbackForm when button is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<MedalliaFeedbackButton />)

    await user.click(container.querySelector('#mdFormButton')!)

    expect(openFeedbackForm).toHaveBeenCalledTimes(1)
  })
})

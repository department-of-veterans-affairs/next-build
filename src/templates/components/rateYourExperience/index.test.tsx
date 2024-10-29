import { render } from '@testing-library/react'
import { RateYourExperience } from './index'

describe('<RateYourExperience>', () => {
  test('renders <RateYourExperience />', () => {
    render(<RateYourExperience />)

    const good = document.querySelector('#Good')
    const bad = document.querySelector('#Bad')
    const radioHeader = document.querySelector('[label="How do you rate your experience on this page?')
    const submitButton = document.querySelector('va-button[text="Submit feedback"]')

    expect(radioHeader).toBeInTheDocument()
    expect(good).toBeInTheDocument()
    expect(bad).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})

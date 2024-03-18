import { render, screen } from '@testing-library/react'
import { NumberCallout } from './index'

describe('NumberCallout with valid data', () => {
  test('renders NumberCallout component', () => {
    render(
      <NumberCallout
        type="paragraph--number_callout"
        id="1"
        numberPhrase="1234 Test"
        description="Test description"
        entityId={1}
      />
    )

    expect(screen.queryByText(/1234 Test/)).toBeInTheDocument()
    expect(screen.queryByText(/Test description/)).toBeInTheDocument()
  })
})

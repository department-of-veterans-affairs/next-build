import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { NumberCallout } from './template'

describe('NumberCallout with valid data', () => {
  test('renders NumberCallout component', async () => {
    const { container } = render(
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

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

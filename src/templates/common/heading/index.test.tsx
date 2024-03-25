import { render } from '@testing-library/react'
import { HeadingElement } from './'

describe('HeadingElement Component', () => {
  test('renders heading element with correct level', () => {
    const { container } = render(
      <HeadingElement headingLevel="h2" slot="my-slot">
        My Heading
      </HeadingElement>
    )
    const headingElement = container.querySelector('h2')
    expect(headingElement).toBeInTheDocument()
    expect(headingElement).toHaveAttribute('slot', 'my-slot')
    expect(headingElement.innerHTML).toBe('My Heading')
  })
})

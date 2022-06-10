import { render, screen } from 'test-utils'
import Greeting from '.'

describe('<Greeting/>', () => {
  test('correctly injects the provided string', () => {
    // The `render()` function, brought in from the React Testing Library,
    // renders its output in such a way that it is accessible through the
    // `screen` object.
    render(<Greeting name="world" />)
    // H1-H6 elements are acceptable to queries for Aria heading roles.
    expect(screen.getByRole('heading')).toHaveTextContent('Hello, world!')
  })
})

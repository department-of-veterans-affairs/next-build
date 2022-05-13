import { render } from '@testing-library/react'
import HomePage from '../pages/index'
import '@testing-library/jest-dom'

// HomePage renders without crashing
test('HomePage renders without crashing', () => {
  render(<HomePage nodes />)
})

// shallow render homepage with nodes
test('HomePage renders a list of nodes', () => {
  const { container } = render(<HomePage nodes={[{ title: 'Test' }]} />)
  expect(container.firstChild).toMatchSnapshot()
})

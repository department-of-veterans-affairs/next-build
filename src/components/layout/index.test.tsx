import { screen, render } from 'test-utils'
import '@testing-library/jest-dom'
import Layout from '.'

// Language: typescript
// Path: src/components/Layout/index.test.tsx

const children = <div></div>

describe('Layout renders with valid data', () => {
  test('<Layout> renders', () => {
    render(<Layout>{children}</Layout>)
    expect(screen.getByText(/Get answers/i)).toBeInTheDocument()
  })
})

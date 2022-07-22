import { screen, render } from 'test-utils'
import '@testing-library/jest-dom'
import Layout from '.'

// Language: typescript
// Path: src/components/Layout/index.test.tsx

const children = <div></div>

describe('<Layout> renders', () => {
  test('body', () => {
    render(
      <>
        <Layout>
          <div>This is the layout</div>
        </Layout>
      </>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test('Footer data', () => {
    render(<Layout>{children}</Layout>)
    expect(screen.queryByText(/Get answers/i)).not.toBeInTheDocument()
  })
})

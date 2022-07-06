import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import Layout from '.'
import Footer from '@/components/footer'

jest.mock('@/components/footer')
const mockChildComponent = jest.fn()
// jest.mock('@/components/footer', () => (props) => {
//   mockChildComponent(props)
//   return <Footer links={} />
// })
//
// jest.mock('@/components/footer', () => ({
//   Footer: jest.fn(({ children }) => (
//     <div data-testid="PostContent">{children}</div>
//   )),
// }))

describe('Layout component renders with valid data', () => {
  test('renders Footer', () => {
    render(
      <Layout>
        <div>This is a test</div>
      </Layout>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test('If Layout has data, Footer is called with data', () => {
    render(<Layout>This is a test</Layout>)
    expect(Footer).toHaveBeenCalledWith(
      expect.objectContaining({
        data: 'This is a test',
      })
    )
  })
})

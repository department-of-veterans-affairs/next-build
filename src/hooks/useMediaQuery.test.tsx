import { render, screen, waitFor } from 'test-utils'
import 'window-matchmedia-polyfill'
import { useMediaQuery } from './useMediaQuery'

const TestElement = ({ width }) => {
  const isBreakpoint = useMediaQuery(width)
  return (
    <div id="test-element">
      {isBreakpoint ? (
        <p>{"We're at the breakpoint!"}</p>
      ) : (
        <p>{"We're not at the breakpoint!"}</p>
      )}
    </div>
  )
}

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height,
  }).dispatchEvent(new this.Event('resize'))
}

describe('useMediaQuery()', () => {
  test('matches snapshot', () => {
    const { container } = render(<TestElement width={100} />)
    expect(container).toMatchSnapshot()
  })

  test('has a reasonable initial state', async () => {
    window.resizeTo(500, 500)

    render(<TestElement width={100} />)
    await waitFor(async () =>
      expect(screen.queryByText(/not at the breakpoint/i)).toBeInTheDocument()
    )
    screen.debug()
  })

  // test('has a reasonable initial state (2)', async () => {
  //   render(<TestElement width={768} />)
  //   window.resizeTo(50, 500)
  //   window.dispatchEvent(new Event('resize'))
  //   await waitFor(
  //     expect(
  //       screen.queryByText(/not at the breakpoint/i)
  //     ).not.toBeInTheDocument()
  //   )
  //   screen.debug()
  // })
})

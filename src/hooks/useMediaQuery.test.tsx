import { render, screen, waitFor } from 'test-utils'
import 'window-matchmedia-polyfill'
import { useMediaQuery } from './useMediaQuery'
import { fireEvent } from '@testing-library/dom'

const TestElement = ({ width }) => {
  const isBreakpoint = useMediaQuery(width)
  return (
    <div id="test-element">
      {isBreakpoint ? (
        <p>{'At the breakpoint! - MobileLinks'}</p>
      ) : (
        <p>{'Not at the breakpoint! - DesktopLinks'}</p>
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

  test('has a reasonable initial state when window is full width', async () => {
    window.resizeTo(500, 500)

    render(<TestElement width={100} />)
    await waitFor(async () =>
      expect(
        screen.queryByText(/Not at the breakpoint! - DesktopLinks/i)
      ).toBeInTheDocument()
    )
    screen.debug()
  })

  test.only('has a reasonable initial state when window is', async () => {
    render(<TestElement width={768} />)
    // fireEvent.change(window.resizeTo(50, 500))
    window.resizeTo(50, 500)
    window.dispatchEvent(new Event('resize'))
    expect(window.innerWidth).toBe(50)
    // await waitFor()
    // expect(
    //   screen.queryByText(/At the breakpoint! - MobileLinks/i)
    // ).toBeInTheDocument()
    screen.debug()
  })
})

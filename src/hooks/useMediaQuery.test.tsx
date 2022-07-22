import { render, screen, waitFor } from 'test-utils'
import 'window-matchmedia-polyfill'
import { useMediaQuery } from './useMediaQuery'
import matchMediaPolyfill from 'mq-polyfill'
import { fireEvent } from '@testing-library/react'

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

matchMediaPolyfill(window)

describe('useMediaQuery()', () => {
  beforeEach(() => {
    window.resizeTo(1024, 500)
  })

  test('sets isBreakpoint to false when window width is > max width', async () => {
    expect(window.innerWidth).toBe(1024)
    window.resizeTo(868, 500)
    fireEvent(window, new Event('resize'))
    render(<TestElement width={768} />)

    await waitFor(async () => {
      expect(
        screen.queryByText(/Not at the breakpoint! - DesktopLinks/i)
      ).toBeInTheDocument()
      expect(window.innerWidth).toBe(868)
    })
  })

  test('sets isBreakpoint to true when window width is < max width', async () => {
    expect(window.innerWidth).toBe(1024)
    window.resizeTo(50, 500)
    fireEvent(window, new Event('resize'))
    render(<TestElement width={768} />)

    await waitFor(async () => {
      expect(
        screen.queryByText(/At the breakpoint! - MobileLinks/i)
      ).toBeInTheDocument()
      expect(window.innerWidth).toBe(50)
    })
  })

  test('sets isBreakpoint to false after resizing window < max width and then > max width', async () => {
    expect(window.innerWidth).toBe(1024)
    window.resizeTo(50, 500)
    fireEvent(window, new Event('resize'))
    window.resizeTo(769, 500)
    fireEvent(window, new Event('resize'))
    render(<TestElement width={768} />)

    await waitFor(async () => {
      expect(
        screen.queryByText(/Not at the breakpoint! - DesktopLinks/i)
      ).toBeInTheDocument()
      expect(window.innerWidth).toBe(769)
    })
  })
})

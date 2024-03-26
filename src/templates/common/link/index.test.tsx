import { render } from '@testing-library/react'
import Link from './'

// Mock useRouter hook for link component
jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: async () => undefined,
    beforePopState: () => undefined,
    events: {
      on: () => undefined,
      off: () => undefined,
      emit: () => undefined,
    },
    isFallback: false,
  }),
}))

describe('Link Component', () => {
  test('renders link with text content correctly', () => {
    const { getByText } = render(
      <Link href="/some-link">
        <span>Link Text</span>
      </Link>
    )

    const linkElement = getByText('Link Text')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement.tagName).toBe('SPAN')
  })
})

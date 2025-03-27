import { render, screen } from '@testing-library/react'
import { ConditionalHeaderLevel } from './index'

describe('ConditionalHeaderLevel', () => {
  for (const headerLevel of [2, 3, 4, 5, 6]) {
    it(`should render a header level ${headerLevel}`, () => {
      render(
        <ConditionalHeaderLevel
          passThroughId="someId"
          headerLevel={headerLevel}
          data-testid={`conditional-header-level-${headerLevel}`}
        >
          Hello
        </ConditionalHeaderLevel>
      )
      const header = screen.getByTestId(
        `conditional-header-level-${headerLevel}`
      )
      expect(header).toBeInTheDocument()
      expect(header.getAttribute('id')).toBe('someId')
      console.warn(JSON.stringify(header.getAttribute('id'), null, 2))
      expect(header).not.toHaveAttribute('slot', 'headline')
    })
  }
  test('should not render a header level 1', () => {
    render(
      <ConditionalHeaderLevel passThroughId="someId" headerLevel={1}>
        Hello
      </ConditionalHeaderLevel>
    )
    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
  })
  test('should not render a header level 7', () => {
    render(
      <ConditionalHeaderLevel passThroughId="someId" headerLevel={7}>
        Hello
      </ConditionalHeaderLevel>
    )
    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
  })
  test('should not render a header level undefined', () => {
    render(
      <ConditionalHeaderLevel passThroughId="someId" headerLevel={undefined}>
        Hello
      </ConditionalHeaderLevel>
    )
    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
  })
  test('should not render a header passThroughId is undefined and headerLevel is valid', () => {
    render(
      <ConditionalHeaderLevel passThroughId={undefined} headerLevel={2}>
        Hello
      </ConditionalHeaderLevel>
    )
    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeadingElement } from './'

describe('<HeadingElement />', () => {
  test.each`
    headingLevel | expectedTag
    ${'h1'}      | ${'H1'}
    ${'h2'}      | ${'H2'}
    ${'h3'}      | ${'H3'}
  `(
    'renders $expectedTag tag when headingLevel is $headingLevel',
    ({ headingLevel, expectedTag }) => {
      render(
        <HeadingElement headingLevel={headingLevel}>
          Test Heading
        </HeadingElement>
      )
      const heading = screen.getByText('Test Heading')
      expect(heading.tagName).toBe(expectedTag)
    }
  )

  test('applies slot attribute when provided', () => {
    const slot = 'test-slot'
    render(
      <HeadingElement headingLevel="h2" slot={slot}>
        Test Heading With Slot
      </HeadingElement>
    )
    const heading = screen.getByText('Test Heading With Slot')
    expect(heading.getAttribute('slot')).toBe(slot)
  })

  test('renders dangerouslySetInnerHTML content correctly', () => {
    const htmlContent = '<span>Test HTML Content</span>'
    render(<HeadingElement headingLevel="h2">{htmlContent}</HeadingElement>)
    expect(screen.getByText('Test HTML Content')).toBeInTheDocument()
  })
})

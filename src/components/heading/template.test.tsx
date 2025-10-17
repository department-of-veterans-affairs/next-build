import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from '@/test-utils'
import { HeadingElement } from './template'

describe('<HeadingElement />', () => {
  test.each`
    headingLevel | expectedTag
    ${'h1'}      | ${'H1'}
    ${'h2'}      | ${'H2'}
    ${'h3'}      | ${'H3'}
  `(
    'renders $expectedTag tag when headingLevel is $headingLevel',
    async ({ headingLevel, expectedTag }) => {
      const { container } = render(
        <HeadingElement headingLevel={headingLevel}>
          Test Heading
        </HeadingElement>
      )
      const heading = screen.getByText('Test Heading')
      expect(heading.tagName).toBe(expectedTag)

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    }
  )

  test('applies slot attribute when provided', async () => {
    const slot = 'test-slot'
    const { container } = render(
      <HeadingElement headingLevel="h2" slot={slot}>
        Test Heading With Slot
      </HeadingElement>
    )
    const heading = screen.getByText('Test Heading With Slot')
    expect(heading.getAttribute('slot')).toBe(slot)

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders dangerouslySetInnerHTML content correctly', async () => {
    const htmlContent = '<span>Test HTML Content</span>'
    const { container } = render(
      <HeadingElement headingLevel="h2">{htmlContent}</HeadingElement>
    )
    expect(screen.getByText('Test HTML Content')).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

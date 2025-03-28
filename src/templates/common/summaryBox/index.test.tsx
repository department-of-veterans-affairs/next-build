import { render, screen } from '@testing-library/react'
import { SummaryBox } from './index'

describe('SummaryBox', () => {
  test('renders with required props', () => {
    render(
      <SummaryBox
        id="summary-box-id"
        type="paragraph--featured_content"
        title="Test Title"
        description="<p>Test description</p>"
        headerLevel={2}
      />
    )

    const header = screen.getByTestId('summary-box-test-title')
    expect(header).toBeInTheDocument()
    expect(header).toHaveAttribute('slot', 'headline')
    expect(header.textContent).toBe('Test Title')
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  test('renders with optional link', () => {
    render(
      <SummaryBox
        title="Test Title"
        description="<p>Test description</p>"
        headerLevel={2}
        // @ts-expect-error - this is a test of no id - should add link to summary box
        link={{
          url: 'https://example.com',
          label: 'Learn more',
        }}
      />
    )
    const vaLink = screen.getByTestId('summary-box-test-title-link')
    expect(vaLink).toHaveAttribute('href', 'https://example.com')
    expect(vaLink).toHaveAttribute('text', 'Learn more')
  })

  test('does not render link when url is missing', () => {
    render(
      <SummaryBox
        title="Test Title"
        description="<p>Test description</p>"
        headerLevel={2}
        // @ts-expect-error - this is a test of no id and no url, should NOT add link to summary box
        link={{
          label: 'Learn more',
        }}
      />
    )

    expect(
      screen.queryByTestId('summary-box-test-title-link')
    ).not.toBeInTheDocument()
  })

  test('does not render link when label is missing', () => {
    render(
      <SummaryBox
        title="Test Title"
        description="<p>Test description</p>"
        headerLevel={2}
        // @ts-expect-error - this is a test of no id and no label, should NOT add link to summary box
        link={{
          url: 'https://example.com',
        }}
      />
    )
    expect(
      screen.queryByTestId('summary-box-test-title-link')
    ).not.toBeInTheDocument()
  })
})

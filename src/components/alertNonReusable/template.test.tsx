import { render, screen } from '@testing-library/react'
import { AlertNonReusable } from './template'
import { AlertType } from '@/components/alert/formatted-type'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'

const wysiwyg: Wysiwyg = {
  id: 'wysiwyg-1',
  type: 'paragraph--wysiwyg',
  html: '<p>Test text</p>',
}

describe('<AlertNonReusable> Component', () => {
  it('renders correctly with valid alertNonReusable props', () => {
    const mockAlertNonReusableData = {
      id: '1',
      alertType: 'info' as AlertType,
      heading: 'Test Heading',
      paragraphs: [wysiwyg],
    }

    const { container } = render(
      <AlertNonReusable {...mockAlertNonReusableData} />
    )
    const alertEl = container.querySelector('va-alert')
    expect(alertEl).toHaveAttribute('status', 'info')
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test text')).toBeInTheDocument()
  })
})

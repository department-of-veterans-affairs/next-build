import { render, screen } from '@testing-library/react'
import AlertNonReusable from './'
import { AlertType } from '@/types/formatted/alert'

import { Wysiwyg } from '@/types/formatted/wysiwyg'

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

    render(<AlertNonReusable {...mockAlertNonReusableData} />)
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'info')
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test text')).toBeInTheDocument()
  })
})

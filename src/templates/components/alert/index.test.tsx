import { render, screen } from '@testing-library/react'
import Alert from './'
import { FormattedParagraph } from '@/data/queries'
import { Alert as FormattedAlert } from '@/types/formatted/alert'
import { AlertType } from '@/types/formatted/alert'
import { AccordionItem as FormattedAccordion } from '@/types/formatted/accordion'
import { Wysiwyg } from '@/types/formatted/wysiwyg'

const mockParagraphs: FormattedParagraph[] = [
  {
    id: '1',
    type: 'paragraph--basic_accordion' as FormattedAccordion['type'],
    header: 'test header',
    html: '<p>test html</p>',
  },
]

const wysiwyg: Wysiwyg = {
  id: 'wysiwyg-1',
  type: 'paragraph--wysiwyg',
  html: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
}

const mockAlert: FormattedAlert = {
  type: 'paragraph--alert',
  id: '1',
  alertType: 'info',
  heading: 'Test Alert Heading',
  blockReference: null,
  paragraphs: mockParagraphs,
}

describe('<Alert> Component', () => {
  it('renders AlertBlock when blockReference is provided', () => {
    const mockAlertWithBlockReference = {
      ...mockAlert,
      blockReference: {
        id: 'block-1',
        alertType: 'warning' as AlertType,
        title: 'Block Reference Title',
        content: wysiwyg,
      },
    }
    render(<Alert {...mockAlertWithBlockReference} />)
    const alertBlock = screen.queryByRole('alert')
    expect(alertBlock).toBeInTheDocument()
    expect(screen.getByText('Block Reference Title')).toBeInTheDocument()
  })

  it('renders custom alert with paragraphs when blockReference is not provided', () => {
    render(<Alert {...mockAlert} />)
    const customAlert = screen.getByRole('alert')
    expect(customAlert).toHaveAttribute(
      'data-paragraph-type',
      'paragraph--alert'
    )
    expect(screen.getByText('Test Alert Heading')).toBeInTheDocument()
    expect(screen.getByText('test html')).toBeInTheDocument()
  })
})

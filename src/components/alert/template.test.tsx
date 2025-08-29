import { render, screen } from '@testing-library/react'
import { Alert } from './template'
import { FormattedParagraph } from '@/lib/drupal/queries'
import { Alert as FormattedAlert } from '@/components/alert/formatted-type'
import { AlertType } from '@/components/alert/formatted-type'
import { AccordionItem as FormattedAccordion } from '@/components/accordion/formatted-type'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'

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
    const { container } = render(<Alert {...mockAlertWithBlockReference} />)
    const alertBlock = container.querySelector('va-alert')
    expect(alertBlock).toBeInTheDocument()
    expect(screen.getByText('Block Reference Title')).toBeInTheDocument()
  })

  it('renders custom alert with paragraphs when blockReference is not provided', () => {
    const { container } = render(<Alert {...mockAlert} />)
    const customAlert = container.querySelector('va-alert')
    expect(customAlert).toHaveAttribute(
      'data-paragraph-type',
      'paragraph--alert'
    )
    expect(screen.getByText('Test Alert Heading')).toBeInTheDocument()
    expect(screen.getByText('test html')).toBeInTheDocument()
  })
})

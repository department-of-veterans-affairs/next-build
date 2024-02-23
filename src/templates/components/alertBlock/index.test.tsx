import { render, screen } from '@testing-library/react'
import { AlertBlock } from './index'
import { AlertBlock as FormattedAlertBlock } from '@/types/formatted/alert'

const blockContent: FormattedAlertBlock = {
  id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
  alertType: 'info',
  title: 'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
  content: {
    header: 'Learn how to sign in',
    text: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
  },
}

describe('<Alert> with valid data and with field_text_expander', () => {
  test('renders info <Alert> component', () => {
    render(<AlertBlock {...blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'info')
  })

  test('renders warning <Alert> component', () => {
    blockContent.alertType = 'warning'
    render(<AlertBlock {...blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'warning')
  })

  test('renders <Alert> component without field_wysiwyg', () => {
    blockContent.content.header = 'Learn how to sign in'
    blockContent.content.text = null
    render(<AlertBlock {...blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
  })
})

describe('<Alert> with valid data and without field_text_expander', () => {
  test('renders info <Alert> component', () => {
    blockContent.content.header = null
    blockContent.alertType = 'info'
    render(<AlertBlock {...blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'info')
  })

  test('renders warning <Alert> component', () => {
    blockContent.content.header = null
    blockContent.alertType = 'warning'
    render(<AlertBlock {...blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'warning')
  })

  test('renders <Alert> component without header', () => {
    blockContent.content.header = null
    render(<AlertBlock {...blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
  })
})

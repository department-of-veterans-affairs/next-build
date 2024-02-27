import { render, screen } from '@testing-library/react'
import { AlertBlock } from './index'
import { AlertBlock as FormattedAlertBlock } from '@/types/formatted/alert'
import { ExpandableText } from '@/types/formatted/expandableText'
import { Wysiwyg } from '@/types/formatted/wysiwyg'

const expandableText: ExpandableText = {
  id: 'et-1',
  type: 'paragraph--expandable_text',
  header: 'Learn how to sign in',
  text: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
}

const wysiwyg: Wysiwyg = {
  id: 'wysiwyg-1',
  type: 'paragraph--wysiwyg',
  html: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
}

const blockContent: FormattedAlertBlock = {
  id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
  alertType: 'info',
  title: 'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
  content: null,
}

describe('<Alert> with valid data and with expandable text', () => {
  const blockContentExpandable: FormattedAlertBlock = {
    ...blockContent,
    content: expandableText,
  }

  test('renders info <Alert> component', () => {
    render(<AlertBlock {...blockContentExpandable} />)

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
    blockContentExpandable.alertType = 'warning'
    render(<AlertBlock {...blockContentExpandable} />)

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
})

describe('<Alert> with valid data and wysiwyg', () => {
  const blockContentWysiwyg: FormattedAlertBlock = {
    ...blockContent,
    content: wysiwyg,
  }

  test('renders info <Alert> component', () => {
    render(<AlertBlock {...blockContentWysiwyg} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'info')
  })

  test('renders warning <Alert> component', () => {
    blockContentWysiwyg.alertType = 'warning'
    render(<AlertBlock {...blockContentWysiwyg} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'warning')
  })
})
